import * as esbuild from "esbuild-wasm";
import { esbuildUnpkgPathPlugin } from "./plugins";

export const initService = async () => {
  try {
    await esbuild.initialize({
      wasmURL: "esbuild.wasm",
      worker: true,
    });
    console.log("Bunlder init");
  } catch (error) {
    if (error instanceof Error) console.log(`${error.name}: ${error.message}`);
  }
};

export const build = async () => {
  return await esbuild.build({
    entryPoints: ["index.js"],
    write: false,
    bundle: true,
    plugins: [esbuildUnpkgPathPlugin]
  });
};

export const transform = (input: string) => {
    return esbuild.transform(input, {
        loader: 'tsx',
        target: "es2015",
    })
}