import { API } from "aws-amplify";

export async function get(id) {
	let result
  if (id) {
    result = await API.get("smartbudget", `/spending/accounts/${id}`);
  } else {
    result = await API.get("smartbudget", "/spending/accounts");
  }
	return result
}

export async function post(account) {
	return await API.post("smartbudget", "/spending/accounts", {
		body: account,
	});
}

export async function put(account) {
	const {id, accountName, accountBalance} = account

	return await API.put("smartbudget", `/spending/accounts/${id}`,{
		body: {
			accountName,
			accountBalance
		}
	})
}