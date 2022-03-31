import { API } from "aws-amplify";

export async function post(order) {
  return await API.post("smartbudget", "/investing/orders/options", {
    body: order,
  });
}

export async function put(order) {
  return await API.put("smartbudget", `/investing/orders/options/${order.id}`, {
    body: order,
  });
}

export async function get() {
  return await API.get("smartbudget", "/investing/orders/options");
}
