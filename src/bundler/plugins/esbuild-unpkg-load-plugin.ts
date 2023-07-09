import axios from "axios";
import * as esbuild from "esbuild-wasm";

export const esbuildUnpkgLoadPlugin: (
  entryPointCode: string
) => esbuild.Plugin = (entryPointCode) => {
  return {
    name: "esbuild-unpkg-load-plugin",
    setup(build) {
      build.onLoad({ filter: /.*/, namespace: "codebook" }, () => ({
        contents: entryPointCode,
        loader: "jsx",
      }));

      build.onLoad({ filter: /.*/, namespace: "unpkg" }, async (args) => {
        const { data, request } = await axios.get(args.path);
        return {
          contents: data,
          resolveDir: new URL(request.responseURL).pathname,
          loader: "jsx",
        };
      });
    },
  };
};
