import { API } from "aws-amplify";

export async function get() {
  return await API.get("smartbudget", `/spending/categories`);
}

export async function put(categories) {
  return await API.put("smartbudget", "/spending/categories", {
    body: categories,
  });
}
