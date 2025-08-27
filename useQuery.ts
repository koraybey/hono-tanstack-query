/* eslint-disable functional/prefer-immutable-types */
import {
  type NoInfer,
  type SkipToken,
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
  type InferSelectReturnType,
  type QueryKey,
} from "./types";
import { getQueryKey } from "./utils";

const queryOptions = <
  E extends Endpoint,
  M extends AvailableMethodKeys<E>,
  P extends EndpointMethodParams<E, M>,
  O extends Omit<
    UseQueryOptions<
      TResponse,
      TError,
      InferSelectReturnType<TResponse, TError>,
      QueryKey<E, M, P>
    >,
    "queryKey" | "queryFn"
  >,
  TResponse = EndpointResponseType<E, M, SuccessStatusCode>,
  TError = EndpointResponseType<E, M, ErrorStatusCode>,
>(
  endpoint: E,
  method: M,
  params: P,
  options?: O,
) => {
  const endpointFn = endpoint[method] as unknown as (
    params: unknown,
  ) => Promise<Response>;
  return {
    queryKey: getQueryKey(endpoint, method, params),
    queryFn: async () => {
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
  } as NoInfer<
    Omit<
      UseQueryOptions<
        TResponse,
        TError,
        InferSelectReturnType<TResponse, O["select"]>,
        QueryKey<E, M, P>
      >,
      "queryFn"
    > & {
      queryFn: Exclude<
        UseQueryOptions<
          TResponse,
          TError,
          InferSelectReturnType<TResponse, O["select"]>,
          QueryKey<E, M, P>
        >["queryFn"],
        SkipToken | undefined
      >;
    }
  >;
};

export const useQuery = <
  E extends Endpoint,
  M extends AvailableMethodKeys<E>,
  P extends EndpointMethodParams<E, M>,
  O extends Omit<
    UseQueryOptions<
      TResponse,
      TError,
      InferSelectReturnType<TResponse, TError>,
      QueryKey<E, M, P>
    >,
    "queryKey" | "queryFn"
  >,
  TResponse = EndpointResponseType<E, M, SuccessStatusCode>,
  TError = EndpointResponseType<E, M, ErrorStatusCode>,
>(
  endpoint: E & Endpoint,
  method: M,
  params: P,
  options?: O,
): UseQueryResult<InferSelectReturnType<TResponse, O["select"]>, TError> =>
  useRQQuery(
    queryOptions<E, M, P, O, TResponse, TError>(
      endpoint,
      method,
      params,
      options,
    ),
  );
