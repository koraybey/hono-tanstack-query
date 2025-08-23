import {
  useQuery as useRQQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import {
  type ClientErrorStatusCode,
  type ServerErrorStatusCode,
  type SuccessStatusCode,
} from "hono/utils/http-status";

import {
  type AvailableMethodKeys,
  type EndpointMethodFn,
  type EndpointMethodParams,
  type EndpointResponseType,
  type QueryKey,
  type WithResponseHandler,
} from "./types";
import { getQueryKey, jsonHandler } from "./utils";

export const queryOptions = <
  T extends object & { $url: () => URL | { toString: () => string } },
  M extends AvailableMethodKeys<T>,
  Params extends EndpointMethodParams<T, M>,
  TResponse = EndpointResponseType<T, M, SuccessStatusCode>,
  TError = EndpointResponseType<
    T,
    M,
    ClientErrorStatusCode | ServerErrorStatusCode
  >,
  TData = TResponse,
  Options extends Omit<
    UseQueryOptions<TResponse, TError, TData, QueryKey<T, M, Params>>,
    "queryKey" | "queryFn"
  > = Omit<
    UseQueryOptions<TResponse, TError, TData, QueryKey<T, M, Params>>,
    "queryKey" | "queryFn"
  >,
>(
  endpoint: T,
  method: M,
  params: Params,
  options?: Readonly<Options & WithResponseHandler<TResponse>>,
) => {
  const endpointFn = endpoint[method] as EndpointMethodFn<T, M>;

  const { responseHandler, ...rqOptions } = (options ??
    {}) as WithResponseHandler<TResponse> & Options;

  return {
    queryKey: getQueryKey(endpoint, method, params),
    queryFn: async () =>
      await (responseHandler ?? jsonHandler)(endpointFn(params)),
    ...rqOptions,
  };
};

export const useQuery = <
  T extends object & { $url: () => URL | { toString: () => string } },
  M extends AvailableMethodKeys<T>,
  Params extends EndpointMethodParams<T, M>,
  TResponse = EndpointResponseType<T, M, SuccessStatusCode>,
  TError = EndpointResponseType<
    T,
    M,
    ClientErrorStatusCode | ServerErrorStatusCode
  >,
  TData = TResponse,
>(
  endpoint: T & { $url: () => URL | { toString: () => string } },
  method: M,
  params: Params,
  options?: Readonly<
    Omit<
      UseQueryOptions<TResponse, TError, TData, QueryKey<T, M, Params>>,
      "queryKey" | "queryFn"
    > &
      WithResponseHandler<TResponse>
  >,
): UseQueryResult<TData, TError> =>
  useRQQuery(
    queryOptions<T, M, Params, TResponse, TError, TData>(
      endpoint,
      method,
      params,
      options,
    ),
  );
