// src/useMutation.ts
import {
  useMutation as useRQMutation
} from "@tanstack/react-query";

// src/utils.ts
var createApiError = (message, status, data) => Object.assign(new Error(message), {
  name: "ApiError",
  status,
  data
});
var createFetcher = (method) => async (params) => {
  const response = await method(params);
  if (response.ok && response.status >= 200 && response.status < 300) {
    return response.json();
  }
  const errorData = await response.json();
  throw createApiError(
    `Request failed with status ${String(response.status)}`,
    response.status,
    errorData
  );
};

// src/useMutation.ts
var useMutation = (method, options) => useRQMutation({
  mutationFn: createFetcher(method),
  ...options
});

// src/useQuery.ts
import {
  useQuery as useRQQuery
} from "@tanstack/react-query";
var useQuery = (method, params, options) => useRQQuery({
  queryKey: [params],
  queryFn: async () => createFetcher(method)(params),
  ...options
});
export {
  useMutation,
  useQuery
};
//# sourceMappingURL=index.mjs.map
