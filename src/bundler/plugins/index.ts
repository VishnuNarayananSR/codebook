import axios from "axios";
import * as esbuild from "esbuild-wasm";

const UNPKG_URL = "https://unpkg.com";
export const esbuildUnpkgPathPlugin: esbuild.Plugin = {
  name: "eesbuildUnpkgPathPluginnv",
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
      console.log(args);
      const result = {
        path: new URL(args.path, UNPKG_URL + args.resolveDir).href,
        namespace: "unpkg",
      };
      return result;
    });
    // handle external package imports
    build.onResolve({ filter: /.*/ }, (args) => {
      console.log(args);
      const result = {
        path: new URL(args.path, UNPKG_URL).href,
        namespace: "unpkg",
      };
      return result;
    });
    build.onLoad({ filter: /.*/, namespace: "codebook" }, () => ({
      contents: `
      import React from 'react@16.0.0';
      const App = () => <div>Hi There</div>
      `,
      loader: "jsx",
    }));

    build.onLoad({ filter: /.*/, namespace: "unpkg" }, async (args) => {
      const { data, request } = await axios.get(args.path);
      console.log(new URL(request.responseURL));
      return {
        contents: data,
        resolveDir: new URL(request.responseURL).pathname,
      };
    });
  },
};
