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
import { createEndpointFetcher, getQueryKey } from "./utils";

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
): UseMutationResult<TResponse, TError, TVariables, TContext> =>
  useRQMutation({
    mutationKey: getQueryKey(endpoint, method),
    mutationFn: createEndpointFetcher<TResponse, TVariables>(
      endpoint[method] as (params: TVariables) => Promise<Response>,
    ),
    ...options,
  });
