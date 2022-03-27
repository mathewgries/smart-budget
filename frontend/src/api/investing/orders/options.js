import { API } from "aws-amplify";

export async function postOptions(order) {
	return await API.post("smartbudget", "/investing/orders/options", {
		body: order,
	});
}