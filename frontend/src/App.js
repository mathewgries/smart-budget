import React, { useState, useEffect } from "react";
import { amplifyClient } from "./api/amplifyClient"
import { AppContext } from "./lib/contextLib";
import { useHistory } from "react-router-dom";
import { onError } from "./lib/errorLib";
import { LinkContainer } from "react-router-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Routes from "./Routes";

function App() {
  const history = useHistory();
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
		await amplifyClient.auth.signOut()
    userHasAuthenticated(false);
    history.push("/login");
  }

  return (
    !isAuthenticating && (
      <div className="app-container">
        <div className="nav-wrapper">
          <Navbar collapseOnSelect bg="light" expand="md" className="mb-3 nav">
            <LinkContainer to="/">
              <Navbar.Brand className="font-weight-bold text-muted">
                Smart Budget
              </Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Nav>
                {isAuthenticated ? (
                  <>
                    <LinkContainer to="/spending">
                      <Nav.Link>Spending</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/investing">
                      <Nav.Link>Investing</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/spending/categories">
                      <Nav.Link>Categories</Nav.Link>
                    </LinkContainer>
										<LinkContainer to="/investing/signals">
                      <Nav.Link>Signals</Nav.Link>
                    </LinkContainer>
                    <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                  </>
                ) : (
                  <>
                    <LinkContainer to="/signup">
                      <Nav.Link>Signup</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/login">
                      <Nav.Link>Login</Nav.Link>
                    </LinkContainer>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Navbar>
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
