import { API } from "aws-amplify";

export async function get(id) {
	let result
  if (id) {
    result = await API.get("smartbudget", `/investing/accounts/${id}`);
  } else {
    result = await API.get("smartbudget", "/investing/accounts");
  }
	return result
}

export async function post(account) {
	return await API.post("smartbudget", "/investing/accounts", {
		body: account,
	});
}

export async function put(account) {
	const {id, accountName, accountBalance} = account

	return await API.put("smartbudget", `/investing/accounts/${id}`,{
		body: {
			accountName,
			accountBalance
		}
	})
}