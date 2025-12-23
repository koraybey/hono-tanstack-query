import type { ClientResponse } from "hono/client";
import type {
  ClientErrorStatusCode,
  ServerErrorStatusCode,
} from "hono/utils/http-status";

export type ErrorStatusCode = ClientErrorStatusCode | ServerErrorStatusCode;

/**
 * Constraint for Hono client methods ($get, $post, etc.)
 * Uses 'any' for args to allow contravariant matching with specific param types.
 */
export type ClientMethod = (
  // eslint-disable-next-line functional/prefer-immutable-types, @typescript-eslint/no-explicit-any
  ...args: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => Promise<ClientResponse<any, any, any>>;

export { type SuccessStatusCode } from "hono/utils/http-status";
