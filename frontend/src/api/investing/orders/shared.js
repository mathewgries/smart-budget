import { API } from "aws-amplify";

export async function getAllOrders() {
    const results = await API.get("smartbudget", `/investing/orders`);
		return results
}