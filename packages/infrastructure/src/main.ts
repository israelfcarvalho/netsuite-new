#!/usr/bin/env node
import fs from "fs";
import zipper from "zip-local";

const nextPublicPath = "/_next/";
const fileExtensions: (string | undefined)[] = ["js", "css", "html", "txt"];
export const main = async () => {
  const filePaths = fs.readdirSync("./out", {
    recursive: true,
    withFileTypes: true,
  });
  const envFile = fs.readFileSync(".env.production", { encoding: "utf-8" });
  const publicPathEnv = envFile
    .split("\n")
    .find((env) => env.includes("NEXT_PUBLIC_BASE_PATH"));
  const publicPath = publicPathEnv?.split("=/")[1];
  const zipBundleEnv = envFile
    .split("\n")
    .find((env) => env.includes("NETSUITE_ZIP_BUNDLE"));
  const zipBundle = zipBundleEnv?.split("=")[1];
  const netsuitePublicPath = `/${publicPath}&resource=/_next/`;

  filePaths.forEach((path) => {
    if (path.isFile()) {
      const fileExtension = path.name.split(".")[1];
      const fileNeedUpgrade = fileExtensions.includes(fileExtension);

      if (fileNeedUpgrade) {
        const file = fs.readFileSync(`${path.parentPath}/${path.name}`, {
          encoding: "utf-8",
        });

        const newFile = file.replaceAll(nextPublicPath, netsuitePublicPath);

        fs.writeFileSync(`${path.parentPath}/${path.name}`, newFile, {
          encoding: "utf-8",
        });
      }
    }
  });

  zipper.sync.zip("./out").compress().save(`./out/${zipBundle}.zip`);
};

await main();
