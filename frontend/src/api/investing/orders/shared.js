import { API } from "aws-amplify";

export async function getAllOrders() {
  const results = await API.get("smartbudget", `/investing/orders`);
  return results;
}

export async function post(order, uriInfo) {
  return await API.post("smartbudget", `/investing/orders/${uriInfo}`, {
    body: order,
  });
}

export async function put(order, uriInfo) {
	return await API.put("smartbudget", `/investing/orders/${uriInfo}/${order.id}`, {
    body: order,
  });
}

export async function get(uriInfo) {
  return await API.get("smartbudget", `/investing/orders/${uriInfo}`);
}

export async function remove(data) {
  const { order } = data;
  return await API.del("smartbudget", `/investing/orders/${order.id}`, {
    body: data,
  });
}
