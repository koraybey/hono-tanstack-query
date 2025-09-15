/* eslint-disable functional/prefer-immutable-types */
import {
  useQuery as useRQQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { type SuccessStatusCode } from "hono/utils/http-status";

import {
  type AvailableMethodKeys,
  type Endpoint,
  type EndpointMethodParams,
  type EndpointResponseType,
  type ErrorStatusCode,
  type QueryKey,
} from "./types";
import { createEndpointFetcher, getQueryKey } from "./utils";

export const useQuery = <
  E extends Endpoint,
  M extends AvailableMethodKeys<E>,
  P extends EndpointMethodParams<E, M>,
  TResponse = EndpointResponseType<E, M, SuccessStatusCode>,
  TError = EndpointResponseType<E, M, ErrorStatusCode>,
  TData = TResponse,
>(
  endpoint: E,
  method: M,
  params: P,
  options?: Omit<
    UseQueryOptions<TResponse, TError, TData, QueryKey<E, M, P>>,
    "queryKey" | "queryFn"
  >,
): UseQueryResult<TData, TError> =>
  useRQQuery({
    queryKey: getQueryKey(endpoint, method, params) as QueryKey<E, M, P>,
    queryFn: async () =>
      createEndpointFetcher<TResponse, P>(
        endpoint[method] as (params: P) => Promise<Response>,
      )(params),
    ...options,
  });
