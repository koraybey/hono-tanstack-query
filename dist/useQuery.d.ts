import { type UseQueryOptions, type UseQueryResult } from "@tanstack/react-query";
import { type InferRequestType, type InferResponseType } from "hono/client";
import type { SuccessStatusCode } from "hono/utils/http-status";
import { type ClientMethod, type ErrorStatusCode } from "./types";
/**
 * Type-safe useQuery hook for Hono RPC client methods.
 *
 * @example
 * ```ts
 * const { data } = useQuery(
 *   client.v2.menu[':locationId'].$get,
 *   { param: { locationId }, query: { diningMode } },
 *   { staleTime: 30_000 }
 * )
 * ```
 */
export declare const useQuery: <M extends ClientMethod, TResponse = InferResponseType<M, SuccessStatusCode>, TError = InferResponseType<M, ErrorStatusCode>, TData = TResponse>(method: M, params: InferRequestType<M>, options?: Omit<UseQueryOptions<TResponse, TError, TData>, "queryFn">) => UseQueryResult<TData, TError>;
