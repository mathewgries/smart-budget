import { API } from "aws-amplify";

export async function getAccounts(){
	return await API.get("smartbudget", "/accounts");
}

export async function getAccountById(id){
	return await API.get("smartbudget", `/accounts/${id}`);
}