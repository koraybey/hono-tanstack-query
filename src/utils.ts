import type * as types from "./types";
import { type QueryKey } from "./types";

const createApiError = (message: string, status: number, data: unknown) =>
  Object.assign(new Error(message), {
    name: "ApiError",
    status,
    data,
  });

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
  params?: P,
) => {
  const urlString = endpoint.$url().toString();
  const path = getPathFromUrl(urlString);
  const hasValidParams =
    // eslint-disable-next-line sonarjs/different-types-comparison
    params !== null &&
    params !== undefined &&
    (typeof params !== "object" || Object.keys(params).length > 0);

  return hasValidParams
    ? ([
        method,
        path,
        {
          ...(typeof params === "object" && {
            ...("param" in params && { param: params.param }),
            ...("query" in params && { query: params.query }),
          }),
        } as P,
      ] as QueryKey<E, M, P>)
    : ([method, path] as [M, string]);
};

export const createEndpointFetcher =
  <TResponse, TVariables>(
    endpointFn: (params: TVariables) => Promise<Response>,
  ) =>
  async (variables: TVariables): Promise<TResponse> => {
    const response = await endpointFn(variables);
    if (response.ok && response.status >= 200 && response.status < 300) {
      return response.json() as Promise<TResponse>;
    }
    const errorData = (await response.json()) as unknown;
    throw createApiError(
      `Request failed with status ${String(response.status)}`,
      response.status,
      errorData,
    );
  };
