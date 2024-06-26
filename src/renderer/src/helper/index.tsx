export const buildQueryParams = (params: { [key: string]: number[] }) => {
  let query = "";

  for (const key in params) {
    if (params[key] && params[key].length) {
      const ids = params[key].map((id) => `v[${key}][]=${id}`).join("&");
      query += `f[]=${key}&op[${key}]=%3D&${ids}&`;
    }
  }

  if (query.endsWith("&")) {
    query = query.slice(0, -1);
  }

  return query;
};
