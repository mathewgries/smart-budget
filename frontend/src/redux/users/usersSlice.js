import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { amplifyClient } from "../../api/amplifyClient";
import { fetchAllData } from "../appSlice";

export const addNewUser = createAsyncThunk("users/addNewUser", async (data) => {
  return await amplifyClient.auth.newUser(data, "smartbudget", "/users");
});

export const getUserInfo = createAsyncThunk("users/getUserInfo", async () => {
  return await amplifyClient.get("smartbudget", "/users/info");
});

export const signUpUser = createAsyncThunk(
  "users/signUpUser",
  async ({ username, password }) => {
    await amplifyClient.auth.signUp({ username, password });
    return username;
  }
);

export const confirmSignUp = createAsyncThunk(
  "users/confirmSignUp",
  async ({ username, confirmationCode }) => {
    return await amplifyClient.auth.confirmSignUp({
      username,
      confirmationCode,
    });
  }
);

export const signInUser = createAsyncThunk(
  "users/signInUser",
  async ({ username, password }) => {
    await amplifyClient.auth.signIn({ username, password });
  }
);

export const getCurrentUser = createAsyncThunk("user/getSession", async () => {
  return await amplifyClient.auth.currentUserInfo();
});

export const getCurrentSession = createAsyncThunk(
  "user/getCurrentSession",
  async () => {
    await amplifyClient.auth.currentSession();
  }
);

export const signOutUser = createAsyncThunk("users/signOutUser", async () => {
  return await amplifyClient.auth.signOut();
});

export const usersSlice = createSlice({
  name: "users",
  initialState: {
    user: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(addNewUser.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(addNewUser.fulfilled, (state, action) => {
        state.status = "success";
        const data = action.payload.find(
          (item) => item.Put.Item.type === "USER#INFO"
        );
        state.user = data.Put.Item;
      })
      .addCase(addNewUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(fetchAllData.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(fetchAllData.fulfilled, (state, action) => {
        state.status = "succeeded";
        const userInfo = action.payload.find(
          (item) => item.type === "USER#INFO"
        );
        state.user = userInfo;
      })
      .addCase(fetchAllData.rejected, (state, action) => {
        state.status = "failed";
      });
    builder
      .addCase(signUpUser.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = {
          username: action.payload.username,
          userConfirmed: false,
        };
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      });
    builder
      .addCase(confirmSignUp.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(confirmSignUp.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user.userConfirmed = action.payload;
      })
      .addCase(confirmSignUp.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      });
    builder
      .addCase(signInUser.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      });
    builder
      .addCase(getCurrentUser.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = {
          ...state.user,
          email: action.payload.attributes.email,
        };
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      });
    builder
      .addCase(getCurrentSession.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(getCurrentSession.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(getCurrentSession.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      });
    builder
      .addCase(signOutUser.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(signOutUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = null;
      })
      .addCase(signOutUser.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      });
  },
});

export default usersSlice.reducer;

export const selectUser = (state) => state.users.user;
