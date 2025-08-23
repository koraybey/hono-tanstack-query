import {
  type AvailableMethodKeys,
  type EndpointMethodParams,
  type MutationKey,
  type QueryKey,
} from "./types";

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
  T extends object & { $url: () => URL | { toString: () => string } },
  M extends AvailableMethodKeys<T>,
  Params extends EndpointMethodParams<T, M>,
>(
  endpoint: T,
  method: M,
  params: Params,
): QueryKey<T, M, Params> => {
  const urlString = endpoint.$url().toString();
  const path = getPathFromUrl(urlString);

  const filteredParams = {
    ...(typeof params === "object" &&
      // eslint-disable-next-line unicorn/no-null
      params != null && {
        ...("param" in params && { param: params.param }),
        ...("query" in params && { query: params.query }),
      }),
  };
  return [method, path, filteredParams] as unknown as QueryKey<T, M, Params>;
};

export const getMutationKey = <
  T extends object & { $url: () => URL | { toString: () => string } },
  M extends AvailableMethodKeys<T>,
>(
  endpoint: T,
  method: M,
): MutationKey<T, M> => {
  const urlString = endpoint.$url().toString();
  const path = getPathFromUrl(urlString);
  return [method, path];
};

export const jsonHandler = async <T>(req: Promise<Response>): Promise<T> => {
  const res = await req;
  if (res.status >= 200 && res.status < 300) {
    return (await res.json()) as T;
  }
  throw new Error(`Request failed with status ${String(res.status)}`);
};
