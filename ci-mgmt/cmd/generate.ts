import * as fs from "fs";
import * as path from "path";
import * as yaml from "yaml";
import * as yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { getConfig } from "../src/config";
import { generate, RepositoryFiles } from "../src/generate";

const args = yargs(hideBin(process.argv))
  .command("generate-providers", "generate the providers")
  .option("name", {
    description: "Project name to generate",
    type: "string",
    alias: "n",
  })
  .demandOption("name")
  .option("path", {
    description: "Path containing the provider repo",
    type: "string",
    alias: "p",
  })
  .demandOption("path")
  .option("debug", {
    description: "Enable debug logging",
    type: "boolean",
  })
  .parseSync();

function debug(message?: any, ...optionalParams: any[]) {
  if (args.debug) {
    console.log(message, ...optionalParams);
  }
}

function writeProviderFiles(basePath: string, provider: RepositoryFiles) {
  const providerRepoPath = path.join(basePath, provider.repository);
  for (const file of provider.files) {
    const filePath = path.join(providerRepoPath, file.path);
    const data =
      typeof file.data === "string"
        ? file.data
        : yaml.stringify(file.data, {
          sortMapEntries: true,
          indentSeq: false,
        });
    debug("Writing", filePath);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, data, { encoding: "utf-8" });
  }
}

const config = getConfig(args.path, args.name);
writeProviderFiles(args.path, generate(config))
