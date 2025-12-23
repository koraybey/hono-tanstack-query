import {
  useMutation as useRQMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import { type InferRequestType, type InferResponseType } from "hono/client";
import type { SuccessStatusCode } from "hono/utils/http-status";

import { type ClientMethod, type ErrorStatusCode } from "./types";
import { createFetcher } from "./utils";

/**
 * Type-safe useMutation hook for Hono RPC client methods.
 *
 * @example
 * ```ts
 * const { mutate } = useMutation(client.v2.user.$patch, {
 *   onSuccess: (data) => console.log(data),
 * })
 *
 * mutate({ json: { name: 'New Name' } })
 * ```
 */
export const useMutation = <
  M extends ClientMethod,
  TResponse = InferResponseType<M, SuccessStatusCode>,
  TError = InferResponseType<M, ErrorStatusCode>,
  TVariables = InferRequestType<M>,
  TContext = unknown,
>(
  method: M,
  // eslint-disable-next-line functional/prefer-immutable-types
  options?: Omit<
    UseMutationOptions<TResponse, TError, TVariables, TContext>,
    "mutationFn"
  >,
): UseMutationResult<TResponse, TError, TVariables, TContext> =>
  useRQMutation({
    mutationFn: createFetcher<TResponse>(method) as (
      variables: TVariables,
    ) => Promise<TResponse>,
    ...options,
  });
