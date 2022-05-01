import React, { useState, useEffect } from "react";
import { amplifyClient } from "./api/amplifyClient";
import { useDispatch } from "react-redux";
import { AppContext } from "./lib/contextLib";
import { useHistory } from "react-router-dom";
import { signOutUser } from "./redux/users/usersSlice";
import { onError } from "./lib/errorLib";
import TopNavBar from "./containers/navigation/TopNavBar";
import Routes from "./Routes";

function App() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await amplifyClient.auth.currentSession();
      userHasAuthenticated(true);
    } catch (e) {
      if (e !== "No current user") {
        onError(e);
      }
    }
    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await dispatch(signOutUser()).unwrap();
    userHasAuthenticated(false);
    history.push("/login");
  }

  return (
    !isAuthenticating && (
      <div className="app-container">
        <div>
          <TopNavBar
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
          />
        </div>
        <div className="app-wrapper">
          <AppContext.Provider
            value={{ isAuthenticated, userHasAuthenticated }}
          >
            <Routes />
          </AppContext.Provider>
        </div>
      </div>
    )
  );
}

export default App;
