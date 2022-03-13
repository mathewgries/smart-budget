import { API } from "aws-amplify";

export async function get(){
		return await API.get("smartbudget", "/spending/transactions")
}

export async function post(data){
	return await API.post("smartbudget", "/spending/transactions", {
		body: data
	})
}

export async function put(data){
	return await API.put("smartbudget", `/spending/transactions/${data.id}`, {
		body: data
	})
}