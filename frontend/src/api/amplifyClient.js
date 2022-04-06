import { API } from "aws-amplify";

export const amplifyClient = {
  auth: {
    signUp: async ({ username, password }) => {
      return await Auth.signUp({ username, password });
    },
    signIn: async ({ username, password }) => {
      return await Auth.signIn(username, password);
    },
    confirmSignUp: async ({ username, confirmationCode }) => {
      return await Auth.confirmSignUp(username, confirmationCode);
    },
    signOut: async () => {
      return await Auth.signOut();
    },
		currentSession: async () => {
			return await Auth.currentSession();
		},
		currentUserInfo: () => {
			return await Auth.currentUserInfo();
		},
  },
  newUser: async (data, api, uri) => {
    return await API.post(api, uri, {
      body: { email: data.attributes.email },
    });
  },
  loadAll: async (api, uri) => {
    return await API.get(api, uri);
  },
  post: async (data, api, uri) => {
    return await API.post(api, uri, { body: data });
  },
  put: async (data, api, uri) => {
    return await API.put(api, uri, { body: data });
  },
  get: async (api, uri) => {
    return await API.get(api, uri);
  },
  remove: async (data, api, uri) => {
    return await API.del(api, uri, {
      body: data,
    });
  },
};


export async function getUserInfo() {
  return await Auth.currentUserInfo();
}



