import {
  useMutation as useRQMutation,
  type UseMutationOptions,
  type UseMutationResult,
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
} from "./types";
import { getMutationKey } from "./utils";

export const mutationOptions = <
  T extends object,
  M extends AvailableMethodKeys<T>,
  TResponse = EndpointResponseType<T, M, SuccessStatusCode>,
  TError = EndpointResponseType<
    T,
    M,
    ClientErrorStatusCode | ServerErrorStatusCode
  >,
  TVariables = EndpointMethodParams<T, M>,
  TContext = unknown,
>(
  endpoint: T & { $url: () => URL | { toString: () => string } },
  method: M,
  options?: Readonly<
    Omit<
      UseMutationOptions<TResponse, TError, TVariables, TContext>,
      "mutationFn" | "mutationKey"
    >
  >,
): UseMutationOptions<TResponse, TError, TVariables, TContext> => {
  const endpointFn = endpoint[method] as EndpointMethodFn<T, M>;

  return {
    mutationKey: getMutationKey(endpoint, method),
    mutationFn: async (variables) => {
      const res = await endpointFn(variables);
      if (res.status >= 200 && res.status < 300) {
        return (await res.json()) as TResponse;
      }
      // FIXME: Better response and error handling.
      throw new Error(`Request failed with status ${String(res.status)}`);
    },
    ...options,
  };
};

export const useMutation = <
  T extends object,
  M extends AvailableMethodKeys<T>,
  TResponse = EndpointResponseType<T, M, SuccessStatusCode>,
  TError = EndpointResponseType<
    T,
    M,
    ClientErrorStatusCode | ServerErrorStatusCode
  >,
  TVariables = EndpointMethodParams<T, M>,
  TContext = unknown,
>(
  endpoint: T & { $url: () => URL | { toString: () => string } },
  method: M,
  options?: Readonly<
    Omit<
      UseMutationOptions<TResponse, TError, TVariables, TContext>,
      "mutationFn" | "mutationKey"
    >
  >,
): UseMutationResult<TResponse, TError, TVariables, TContext> =>
  useRQMutation(
    mutationOptions<T, M, TResponse, TError, TVariables, TContext>(
      endpoint,
      method,
      options,
    ),
  );
