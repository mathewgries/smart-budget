import { API } from "aws-amplify";

export async function getAllOrders() {
    return await API.get("smartbudget", `/investing/orders`);
}