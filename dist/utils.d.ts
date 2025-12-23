/**
 * Creates a fetcher function for a Hono client method.
 * Handles response parsing and error throwing.
 */
export declare const createFetcher: <TResponse>(method: (params: unknown) => Promise<Response>) => (params: unknown) => Promise<TResponse>;
