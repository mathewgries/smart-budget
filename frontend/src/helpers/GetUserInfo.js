import { Auth } from "aws-amplify";

export default async function getUserInfo(){
	return await Auth.currentUserInfo();
}