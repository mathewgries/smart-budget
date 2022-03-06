import { API } from "aws-amplify";

export async function get(){
		return await API.get("smartbudget", "/transactions")
}

export async function post(data){
	return await API.post("smartbudget", "/transactions", {
		body: data
	})
}

export async function put(data){
	return await API.put("smartbudget", `/transactions/${data.id}`, {
		body: data
	})
}