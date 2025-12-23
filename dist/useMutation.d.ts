import { type UseMutationOptions, type UseMutationResult } from "@tanstack/react-query";
import { type InferRequestType, type InferResponseType } from "hono/client";
import type { SuccessStatusCode } from "hono/utils/http-status";
import { type ClientMethod, type ErrorStatusCode } from "./types";
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
export declare const useMutation: <M extends ClientMethod, TResponse = InferResponseType<M, SuccessStatusCode>, TError = InferResponseType<M, ErrorStatusCode>, TVariables = InferRequestType<M>, TContext = unknown>(method: M, options?: Omit<UseMutationOptions<TResponse, TError, TVariables, TContext>, "mutationFn">) => UseMutationResult<TResponse, TError, TVariables, TContext>;
