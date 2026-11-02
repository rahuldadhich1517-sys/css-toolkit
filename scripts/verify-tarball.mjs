import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

console.log('=== Verifying Built Package Tarball in Isolated Consumer ===');

const projectRoot = process.cwd();

// 1. Pack tarball
console.log('1. Packing tarball...');
const packOutput = execSync('npm pack', { cwd: projectRoot, encoding: 'utf-8' }).trim();
const tarballName = packOutput.split('\n').pop().trim();
const tarballPath = path.resolve(projectRoot, tarballName);
console.log(`Created tarball: ${tarballPath}`);

// 2. Create temp consumer directory
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'css-toolkit-consumer-'));
console.log(`2. Created temporary consumer directory: ${tempDir}`);

try {
  // 3. Initialize consumer project
  console.log('3. Initializing consumer project & installing tarball...');
  execSync('npm init -y', { cwd: tempDir, stdio: 'ignore' });
  execSync(`npm install "${tarballPath}"`, { cwd: tempDir, stdio: 'inherit' });

  // 4. Copy smoke test scripts
  const smokeEsmSrc = path.join(projectRoot, 'scripts', 'smoke-esm.mjs');
  const smokeCjsSrc = path.join(projectRoot, 'scripts', 'smoke-cjs.cjs');
  const smokeEsmDest = path.join(tempDir, 'smoke-esm.mjs');
  const smokeCjsDest = path.join(tempDir, 'smoke-cjs.cjs');

  fs.copyFileSync(smokeEsmSrc, smokeEsmDest);
  fs.copyFileSync(smokeCjsSrc, smokeCjsDest);

  // 5. Run ESM and CommonJS smoke tests in consumer directory
  console.log('4. Running ESM smoke test in consumer...');
  execSync(`node "${smokeEsmDest}"`, { cwd: tempDir, stdio: 'inherit' });

  console.log('5. Running CommonJS smoke test in consumer...');
  execSync(`node "${smokeCjsDest}"`, { cwd: tempDir, stdio: 'inherit' });

  console.log('\n✓ Isolated Consumer Tarball Verification: SUCCESS');
} finally {
  // Clean up
  console.log('6. Cleaning up temporary consumer and tarball...');
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
  } catch (err) {
    console.warn(`Could not remove temp dir ${tempDir}:`, err.message);
  }
  try {
    if (fs.existsSync(tarballPath)) {
      fs.unlinkSync(tarballPath);
    }
  } catch (err) {
    console.warn(`Could not remove tarball ${tarballPath}:`, err.message);
  }
}
