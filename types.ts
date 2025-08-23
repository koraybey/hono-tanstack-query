import type { InferResponseType } from "hono/client";
import type { StatusCode } from "hono/utils/http-status";

export type HttpMethodKey =
  | "$get"
  | "$post"
  | "$put"
  | "$delete"
  | "$patch"
  | "$options"
  | "$head";

export type ResponseHandler<T> = (req: Promise<Response>) => Promise<T>;

export interface WithResponseHandler<T> {
  readonly responseHandler?: ResponseHandler<T>;
}

export type AvailableMethodKeys<T> = Extract<keyof T, HttpMethodKey>;

export type EndpointMethodParams<
  T extends object,
  M extends AvailableMethodKeys<T>,
> = T[M] extends (params: infer P) => Promise<Response> ? P : never;

export type EndpointResponseType<
  T extends object,
  M extends AvailableMethodKeys<T>,
  U extends StatusCode = StatusCode,
> = T[M] extends (...args: readonly unknown[]) => Promise<Response>
  ? InferResponseType<T[M], U>
  : never;

export type EndpointMethodFn<
  T extends object,
  M extends AvailableMethodKeys<T>,
> = T[M] extends (params: infer P) => Promise<Response>
  ? (params: P) => Promise<Response>
  : never;

export type QueryKey<
  T extends object & { $url: () => URL | { toString: () => string } },
  M extends AvailableMethodKeys<T>,
  Params extends EndpointMethodParams<T, M>,
> = [M, string, Params];

export type MutationKey<
  T extends object & { $url: () => URL | { toString: () => string } },
  M extends AvailableMethodKeys<T>,
> = [M, string];
