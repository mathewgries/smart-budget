import { API } from "aws-amplify";

export const amplifyClient = {
  newUser: async (data, api, uri) => {
    return await API.post(api, uri, {
      body: { email: data.attributes.email },
    });
  },
  loadAll: async (api, uri) => {
    return await API.get(api, uri);
  },
  post: async (data, api, uri) => {
    return await API.post(api, uri, { body: data });
  },
  put: async (data, api, uri) => {
    return await API.put(api, uri, { body: data });
  },
  get: async () => {},
  remove: async (data, api, uri) => {
    const { order } = data;
    return await API.del(api, uri, {
      body: data,
    });
  },
};

export async function get(uriInfo) {
  return await API.get("smartbudget", `/investing/orders/${uriInfo}`);
}

export async function remove(data) {
  const { order } = data;
  return await API.del("smartbudget", `/investing/orders/${order.id}`, {
    body: data,
  });
}
