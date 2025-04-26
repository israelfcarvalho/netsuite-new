#!/usr/bin/env node
import fs from "fs";
import zipper from "zip-local";

const nextPublicPath = "/_next/";
const fileExtensions: (string | undefined)[] = ["js", "css", "html", "txt"];

const replaceEnvVariables = (content: string, envVars: Record<string, string>): string => {
  return content.replace(/\${([^}]+)}/g, (match, varName) => {
    return envVars[varName] || match;
  });
};

export const main = async () => {
  const filePaths = fs.readdirSync("./out", {
    recursive: true,
    withFileTypes: true,
  });
  
  const envFile = fs.readFileSync(".env.production", { encoding: "utf-8" });
  const envVars = envFile.split("\n").reduce((acc, line) => {
    const [key, ...valueParts] = line.split("=");
    if (key && valueParts.length > 0) {
      acc[key.trim()] = valueParts.join("=").trim();
    }
    return acc;
  }, {} as Record<string, string>);

  const publicPath = envVars["NEXT_PUBLIC_BASE_PATH"];
  const zipBundle = envVars["NETSUITE_ZIP_BUNDLE"];
  const netsuitePublicPath = `${publicPath}&resource=/_next/`;

  filePaths.forEach((path) => {
    if (path.isFile()) {
      const fileExtension = path.name.split(".")[1];
      const fileNeedUpgrade = fileExtensions.includes(fileExtension);

      if (fileNeedUpgrade) {
        const filePath = `${path.parentPath}/${path.name}`;
        let content = fs.readFileSync(filePath, { encoding: "utf-8" });

        // First replace the _next path
        content = content.replaceAll(nextPublicPath, netsuitePublicPath);
        
        // Then replace any environment variables
        content = replaceEnvVariables(content, envVars);

        fs.writeFileSync(filePath, content, { encoding: "utf-8" });
      }
    }
  });

  zipper.sync.zip("./out").compress().save(`./out/${zipBundle}.zip`);
};

await main();
