import { Auth} from 'aws-amplify'

export async function signInUser({email, password}){
	return await Auth.signIn(email, password);
}

export async function logOutUser(){
	return await Auth.signOut();
}