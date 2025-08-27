/* eslint-disable functional/prefer-immutable-types */
import {
  useMutation as useRQMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import type { SuccessStatusCode } from "hono/utils/http-status";

import {
  type AvailableMethodKeys,
  type Endpoint,
  type EndpointMethodParams,
  type EndpointResponseType,
  type ErrorStatusCode,
} from "./types";
import { getQueryKey } from "./utils";

export const useMutation = <
  E extends Endpoint,
  M extends AvailableMethodKeys<E>,
  TResponse = EndpointResponseType<E, M, SuccessStatusCode>,
  TError = EndpointResponseType<E, M, ErrorStatusCode>,
  TVariables = EndpointMethodParams<E, M>,
  TContext = unknown,
>(
  endpoint: E,
  method: M,
  options?: Omit<
    UseMutationOptions<TResponse, TError, TVariables, TContext>,
    "mutationFn" | "mutationKey"
  >,
): UseMutationResult<TResponse, TError, TVariables, TContext> => {
  const endpointFn = endpoint[method] as unknown as (
    params: TVariables,
  ) => Promise<Response>;

  return useRQMutation({
    mutationKey: getQueryKey(endpoint, method, {} as never),
    mutationFn: async (variables: TVariables): Promise<TResponse> => {
      const res = await endpointFn(variables);
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
