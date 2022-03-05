import { API } from "aws-amplify";

export async function get() {
  return await API.get("smartbudget", `/categories`);
}

export async function put(categories) {
  return await API.put("smartbudget", "/categories", {
    body: categories,
  });
}
