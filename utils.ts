import type * as types from "./types";
import { type QueryKey } from "./types";

const getPathFromUrl = (url: string): string => {
  try {
    if (url.startsWith("http")) {
      const urlObj = new URL(url);
      return urlObj.pathname;
    }
    return url;
  } catch {
    return url;
  }
};

export const getQueryKey = <
  E extends types.Endpoint,
  M extends types.AvailableMethodKeys<E>,
  P extends types.EndpointMethodParams<E, M>,
>(
  endpoint: E,
  method: M,
  params: P,
) => {
  const urlString = endpoint.$url().toString();
  const path = getPathFromUrl(urlString);

  const filteredParams = {
    ...(typeof params === "object" &&
      // eslint-disable-next-line unicorn/no-null
      params != null && {
        ...("param" in params && { param: params.param }),
        ...("query" in params && { query: params.query }),
      }),
  } as P;
  return [method, path, filteredParams] as QueryKey<E, M, P>;
};
