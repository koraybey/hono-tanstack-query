/**
 * Creates an API error with status and data attached.
 */
const createApiError = (message: string, status: number, data: unknown) =>
  Object.assign(new Error(message), {
    name: "ApiError",
    status,
    data,
  });

/**
 * Creates a fetcher function for a Hono client method.
 * Handles response parsing and error throwing.
 */
export const createFetcher =
  <TResponse>(method: (params: unknown) => Promise<Response>) =>
  async (params: unknown): Promise<TResponse> => {
    const response = await method(params);
    if (response.ok && response.status >= 200 && response.status < 300) {
      return response.json() as Promise<TResponse>;
    }
    const errorData = (await response.json()) as unknown;
    throw createApiError(
      `Request failed with status ${String(response.status)}`,
      response.status,
      errorData,
    );
  };
