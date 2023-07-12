import localForage from "localforage";
import * as esbuild from "esbuild-wasm";

const store = localForage.createInstance({
  name: "pkg-cache",
});

type getOrSetPkgCacheType<
  T extends esbuild.OnLoadResult = esbuild.OnLoadResult
> = (key: string, fetchPkgData: () => Promise<T>) => Promise<T>;

const getOrSetPkgCache: getOrSetPkgCacheType = async (key, fetchPkgData) => {
  const cachedData = await store.getItem<esbuild.OnLoadResult>(key);
  if (cachedData) {
    return cachedData;
  }
  const data = await fetchPkgData();
  store.setItem(key, data);
  return data;
};

export default getOrSetPkgCache;
