import * as esbuild from "esbuild-wasm";
import { REPO_URL } from ".";

export const esbuildUnpkgResolvePlugin: esbuild.Plugin = {
  name: "esbuild-unpkg-resolve-plugin",
  setup(build) {
    // handle main file from codebook cell
    build.onResolve({ filter: /^index\.js$/ }, (args) => {
      return {
        path: args.path,
        namespace: "codebook",
      };
    });
    // handle relative imports
    build.onResolve({ filter: /^\.+/ }, (args) => {
      const result = {
        path: new URL(args.path, REPO_URL + args.resolveDir).href,
        namespace: "unpkg",
      };
      return result;
    });
    // handle external package imports
    build.onResolve({ filter: /.*/ }, (args) => {
      const result = {
        path: new URL(args.path, REPO_URL).href,
        namespace: "unpkg",
      };
      return result;
    });
  },
};
