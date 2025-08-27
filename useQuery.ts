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
import { getQueryKey } from "./utils";

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
): UseQueryResult<TData, TError> => {
  const endpointFn = endpoint[method] as unknown as (
    params: unknown,
  ) => Promise<Response>;

  return useRQQuery({
    queryKey: getQueryKey(endpoint, method, params),
    queryFn: async (): Promise<TResponse> => {
      const res = await endpointFn(params);
      if (res.status >= 200 && res.status < 300) {
        return (await res.json()) as TResponse;
      }
      const errorData = (await res.json()) as TError;
      const error = Object.assign(
        new Error(`Request failed with status ${String(res.status)}`),
        {
          status: res.status,
          data: errorData,
        },
      ) as Error & {
        status: number;
        data: TError;
      };
      throw error;
    },
    ...options,
  });
};
