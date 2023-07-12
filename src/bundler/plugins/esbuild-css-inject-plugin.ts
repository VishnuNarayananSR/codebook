import * as esbuild from "esbuild-wasm";
import axios from "axios";
import { REPO_URL } from ".";
import getOrSetCacheData from "../cache";

const injectCss = (sourceCSS: string) => {
  //escape single quotes, for wrapping in ' '
  const escapedCSS = sourceCSS.replace(/\n/g, "").replace(/'/g, "\\'");
  return `(function(){
            var e = document.createElement('style');
            e.textContent = '${escapedCSS}';
            document.head.appendChild(e);
      })();`;
};

export const esbuildCssInjectPlugin: esbuild.Plugin = {
  name: "esbuild-css-inject-plugin",
  setup(build) {
    build.onResolve({ filter: /\.css$/ }, (args) => {
      return {
        path: new URL(args.path, REPO_URL + args.resolveDir).href,
        namespace: "css",
      };
    });

    build.onLoad({ filter: /.*/, namespace: "css" }, (args) => {
      return getOrSetCacheData(args.path, async () => {
        const { data, request } = await axios.get(args.path);
        return {
          contents: injectCss(data),
          resolveDir: new URL(request.responseURL).pathname,
          loader: "jsx",
        };
      });
    });
  },
};
