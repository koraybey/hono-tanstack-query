/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable functional/prefer-immutable-types */
import type { InferResponseType } from "hono/client";
import type {
  ClientErrorStatusCode,
  ServerErrorStatusCode,
  StatusCode,
} from "hono/utils/http-status";

export type ErrorStatusCode = ClientErrorStatusCode | ServerErrorStatusCode;

export type ExcludeString<T> = T extends string ? never : T;

export type HttpMethodKey =
  | "$get"
  | "$post"
  | "$put"
  | "$delete"
  | "$patch"
  | "$options"
  | "$head";

export type AvailableMethodKeys<T> = Extract<keyof T, HttpMethodKey>;

export type Endpoint = object & {
  $url: () => URL | { toString: () => string };
};

export type EndpointResponseType<
  E extends object,
  M extends AvailableMethodKeys<E>,
  S extends StatusCode = StatusCode,
> = E[M] extends (...args: any[]) => Promise<Response>
  ? // InferResponseType adds string when indexing generics with method key.
    // When TypeScript evaluates E[M] where E is typeof client.v1.order.commit and M is '$post', it's resolving to a broader type than when you directly access client.v1.order.commit.$post.
    // The E[M] lookup is hitting Hono's internal type machinery, which likely has a fallback that includes string for cases where the response parsing might fail or for non-JSON responses.
    // Following types produce nearly identical results except there is an additional 'string' in the union type:
    // InferResponseType<typeof client.v1.order.commit.$post> and EndpointResponseType<typeof client.v1.order.commit, '$post'>
    // Until I find the culprit, let's omit the string and hope endpoints only return JSON.
    ExcludeString<InferResponseType<E[M], S>>
  : never;

export type EndpointMethodParams<
  E extends object,
  M extends AvailableMethodKeys<E>,
> = E[M] extends (params: infer P, ...args: any[]) => any ? P : never;

export type QueryKey<
  E extends Endpoint,
  M extends AvailableMethodKeys<E>,
  Params extends EndpointMethodParams<E, M>,
> = [M, string, Params];
