import { API } from "aws-amplify";

export async function get(id) {
    return await API.get("smartbudget", `/investing/signals`);
}

export async function put(signalList) {

	return await API.put("smartbudget", "/investing/signals",{
		body: signalList
	})
}