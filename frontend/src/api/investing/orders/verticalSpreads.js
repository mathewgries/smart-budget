import { API } from "aws-amplify";

export async function postVerticalSpread(order) {
	return await API.post("smartbudget", "/investing/orders/spreads/vertical", {
		body: order,
	});
}