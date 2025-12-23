"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  useMutation: () => useMutation,
  useQuery: () => useQuery
});
module.exports = __toCommonJS(src_exports);

// src/useMutation.ts
var import_react_query = require("@tanstack/react-query");

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
var useMutation = (method, options) => (0, import_react_query.useMutation)({
  mutationFn: createFetcher(method),
  ...options
});

// src/useQuery.ts
var import_react_query2 = require("@tanstack/react-query");
var useQuery = (method, params, options) => (0, import_react_query2.useQuery)({
  queryKey: [params],
  queryFn: async () => createFetcher(method)(params),
  ...options
});
//# sourceMappingURL=index.cjs.map
