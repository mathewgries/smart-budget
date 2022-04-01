import { API } from "aws-amplify";

export async function post(order) {
  return await API.post("smartbudget", "/investing/orders/shares", {
    body: order,
  });
}

export async function put(order) {
  return await API.post("smartbudget", `/investing/orders/shares/${order.id}`, {
    body: order,
  });
}

export async function get() {
  return await API.get("smartbudget", "/investing/orders/shares");
}
