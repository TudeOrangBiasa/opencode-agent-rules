import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, "../..");

const globalConfigDir = path.join(
  process.env.HOME || process.env.USERPROFILE || "",
  ".config",
  "opencode"
);

/**
 * Symlink files from source directory to target directory.
 * Skips if target already exists as a regular file (user override).
 * Skips if already symlinked.
 */
function symlinkDir(sourceDir, targetDir) {
  if (!fs.existsSync(sourceDir)) return;

  try {
    fs.mkdirSync(targetDir, { recursive: true });

    const entries = fs.readdirSync(sourceDir, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(sourceDir, entry.name);
      const destPath = path.join(targetDir, entry.name);

      if (entry.isDirectory()) {
        symlinkDir(srcPath, destPath);
        continue;
      }

      if (!entry.name.endsWith(".md") && !entry.name.endsWith(".js")) continue;

      if (fs.existsSync(destPath)) {
        try {
          const stat = fs.lstatSync(destPath);
          if (stat.isSymbolicLink()) continue;
        } catch {
          // lstat failed, skip
        }
        continue;
      }

      fs.symlinkSync(srcPath, destPath);
    }
  } catch (err) {
    // Silently fail
  }
}

// Run symlinks immediately when the module loads
(function setup() {
  // Symlink rules to global rules directory
  const rulesSource = path.join(packageRoot, ".opencode", "rules");
  const rulesTarget = path.join(globalConfigDir, "rules");
  symlinkDir(rulesSource, rulesTarget);

  // Symlink commands to global commands directory
  const commandsSource = path.join(packageRoot, ".opencode", "commands");
  const commandsTarget = path.join(globalConfigDir, "commands");
  symlinkDir(commandsSource, commandsTarget);
})();

export default (async ({ client, project, directory, $ }) => {
  return {
    config(cfg) {
      // No skills to register for agent-rules
    },
  };
});
