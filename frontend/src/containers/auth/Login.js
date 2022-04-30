import React, { useState } from "react";
import { amplifyClient } from "../../api/amplifyClient";
import { useHistory } from "react-router-dom";
import { useAppContext } from "../../lib/contextLib";
import { Link } from "react-router-dom";
import { onError } from "../../lib/errorLib";
import LoadingSpinner from "../../components/LoadingSpinner";
import "./auth.css";

export default function Login() {
  const history = useHistory();
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, setFields] = useState({
    email: "",
    password: "",
  });

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      await amplifyClient.auth.signIn({
        username: fields.email,
        password: fields.password,
      });
      userHasAuthenticated(true);
      history.push("/", { from: "/login" });
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  return (
    <div className="page-container">
      <div className="page-wrapper">
        <div className="form-wrapper">
          <form onSubmit={handleSubmit}>
            <section className="page-header-wrapper">
              <header className="page-header">
                <h4>Login</h4>
              </header>
            </section>
            <section className="form-section">
              <div className="form-group">
                <label>Email</label>
                <input
                  className="form-control"
                  autoFocus
                  type="email"
                  name="email"
                  value={fields.email}
                  onChange={(e) =>
                    setFields({ ...fields, [e.target.name]: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  className="form-control"
                  type="password"
                  name="password"
                  value={fields.password}
                  onChange={(e) =>
                    setFields({ ...fields, [e.target.name]: e.target.value })
                  }
                />
              </div>
              <div className="auth-btn-wrapper">
                <div className="form-group">
                  <button
                    className="btn btn-add-new"
                    type="submit"
                    disabled={!validateForm()}
                  >
                    {isLoading ? <LoadingSpinner /> : "Login"}
                  </button>
                </div>
                <div className="form-group">
                  <Link
                    className="btn btn-edit"
                    to={"/signup"}
                    style={isLoading ? { pointerEvents: "none" } : null}
                  >
                    Signup
                  </Link>
                </div>
              </div>
            </section>
          </form>
        </div>
      </div>
    </div>
  );
}
