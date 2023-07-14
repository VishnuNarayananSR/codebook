import * as esbuild from "esbuild-wasm";
import {
  esbuildUnpkgLoadPlugin,
  esbuildUnpkgResolvePlugin,
  esbuildCssInjectPlugin,
} from "./plugins";

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

export const build = async (code: string) => {
  return await esbuild.build({
    entryPoints: ["index.js"],
    write: false,
    bundle: true,
    plugins: [
      esbuildCssInjectPlugin,
      esbuildUnpkgLoadPlugin(code),
      esbuildUnpkgResolvePlugin,
    ],
    define: { "process.env.NODE_ENV": "'production'", global: "window" },
  });
};

export const transform = (input: string) => {
  return esbuild.transform(input, {
    loader: "jsx",
    target: "es2015",
  });
};
