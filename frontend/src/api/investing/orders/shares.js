import { API } from "aws-amplify";

export async function postShares(order) {
	return await API.post("smartbudget", "/investing/orders/shares", {
		body: order,
	});
}