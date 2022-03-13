import { API } from "aws-amplify";

export async function get(){
		return await API.get("smartbudget", "/investing/transactions")
}

export async function post(data){
	return await API.post("smartbudget", "/investing/transactions", {
		body: data
	})
}

export async function put(data){
	return await API.put("smartbudget", `/investing/transactions/${data.id}`, {
		body: data
	})
}