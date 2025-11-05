import * as esbuild from "esbuild";
import * as vsce from "@vscode/vsce";
import {ESLint} from "eslint";
import {rm, readFile} from "fs/promises";
import {existsSync, rmSync, mkdirSync} from "fs";
import path from "path";

const extensionDir = "extension";
const distDir = "dist";

async function getVersion() {
  const packageJsonPath = path.join(process.cwd(), "package.json");
  const data = await readFile(packageJsonPath, "utf-8");
  const pkg = JSON.parse(data);
  return pkg.version;
}

async function runEslint() {
  const eslint = new ESLint({
    overrideConfig: {},
  });

  const results = await eslint.lintFiles(["src/**/*.ts"]);
  const formatter = await eslint.loadFormatter("stylish");
  const res = formatter.format(results);
  if (!res || res == "") console.log("ESLint OK");
  else console.error(res);

  // Return has errors or not
  return !results.some((r) => r.errorCount > 0);
}

async function bundle() {
  const entryPoints = ["src/main.ts", "src/bulb128.png"];
  const context = await esbuild.context({
    entryPoints: entryPoints,
    outExtension: {".js": ".cjs"},
    format: "cjs",
    outdir: extensionDir,
    external: ["vscode"],
    bundle: true,
    platform: "node",
    loader: {
      ".png": "copy",
    },
    write: true,
    metafile: true,
  });

  try {
    await context.rebuild();
    return true;
  } catch (err) {
    return false;
  } finally {
    await context.dispose();
  }
}

async function packageVsix(version) {
  try {
    const packagePath = path.join(process.cwd(), distDir, `anode-live-${version}.vsix`);
    await vsce.createVSIX({
      cwd: process.cwd(),
      packagePath,
    });
    return true;
  } catch (err) {
    console.error("Failed to package extension with vsce:");
    console.error(err);
    return false;
  }
}

async function clean() {
  if (existsSync(extensionDir)) {
    await rm(extensionDir, {recursive: true, force: true});
    console.log(`Deleted existing ${extensionDir} folder`);
  }

  if (existsSync(distDir)) {
    rmSync(distDir, {recursive: true, force: true});
  }
  mkdirSync(distDir, {recursive: true});
  console.log(`Emptied ${distDir} folder.`);
}

async function build() {
  await clean();

  const version = await getVersion();

  if (!(await runEslint())) {
    console.error("ESLint found errors.");
    process.exit(1);
  }
  if (!(await bundle())) {
    console.error("Failed to build bundle.");
    process.exit(1);
  }

  if (!(await packageVsix(version))) {
    process.exit(1);
  }
}

await build();
