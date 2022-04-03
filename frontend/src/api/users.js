import { Auth, API } from "aws-amplify";

export async function signInUser({ email, password }) {
  return await Auth.signIn(email, password);
}

export async function logOutUser() {
  return await Auth.signOut();
}

export async function getUserInfo(){
	return await Auth.currentUserInfo();
}

export async function setupNewUser(userInfo) {
  return await API.post("smartbudget", "/users", {
    body: {
      email: userInfo.attributes.email,
    },
  });
}

export async function getAllData(){
	return await API.get("smartbudget", "/users")
}
