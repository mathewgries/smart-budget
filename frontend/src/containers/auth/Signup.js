import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { onError } from "../../lib/errorLib";
import {
  signUpUser,
  confirmSignUp,
  selectUser,
  signInUser,
  getCurrentUser,
  addNewUser,
} from "../../redux/users/usersSlice";
import { useAppContext } from "../../lib/contextLib";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import "./auth.css";

export default function Signup() {
  const dispatch = useDispatch();
  const [fields, setFields] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    confirmationCode: "",
  });
  const history = useHistory();
  const user = useSelector((state) => selectUser(state));
  const status = useSelector((state) => state.users.status);
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "pending") {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [status]);

  function validateForm() {
    return (
      fields.email.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }

  function validateConfirmationForm() {
    return fields.confirmationCode.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await dispatch(
        signUpUser({
          username: fields.email,
          password: fields.password,
        })
      ).unwrap();
    } catch (e) {
      onError(e);
    }
  }

  async function handleConfirmationSubmit(event) {
    event.preventDefault();

    try {
      await dispatch(
        confirmSignUp({
          username: fields.email,
          confirmationCode: fields.confirmationCode,
        })
      ).unwrap();

      await dispatch(
        signInUser({
          username: fields.email,
          password: fields.password,
        })
      ).unwrap();

      await dispatch(getCurrentUser()).unwrap();

      await dispatch(addNewUser({ email: user.email })).unwrap();

      userHasAuthenticated(true);
      history.push("/");
    } catch (e) {
      onError(e);
    }
  }

  function renderConfirmationForm() {
    return (
      <div className="page-wrapper">
        <div className="form-wrapper">
          <form onSubmit={handleConfirmationSubmit}>
            <section className="page-header-wrapper">
              <header className="page-header">
                <h4>Conirm Signup</h4>
              </header>
            </section>
            <section className="form-section">
              <div className="form-group">
                <label>Confirmation Code</label>
                <input
                  className="form-control"
                  autoFocus
                  type="tel"
                  name="confirmationCode"
                  onChange={(e) =>
                    setFields({ ...fields, [e.target.name]: e.target.value })
                  }
                  value={fields.confirmationCode}
                  data-lpignore="true"
                />
                <span style={{ color: "#ee6c4d" }}>
                  Please check your email for the code.
                </span>
              </div>
              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-add-new"
                  disabled={!validateConfirmationForm()}
                >
                  {isLoading ? <LoadingSpinner /> : "Verify"}
                </button>
              </div>
            </section>
          </form>
        </div>
      </div>
    );
  }

  function renderForm() {
    return (
      <div className="page-wrapper">
        <div className="form-wrapper">
          <form onSubmit={handleSubmit}>
            <section className="page-header-wrapper">
              <header className="page-header">
                <h4>Signup</h4>
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
                <label>
                  Password <br />
                  <span style={{ color: "#ee6c4d" }}>
                    (uppercase letters, lowercase letters, special characters,
                    numbers)
                  </span>
                </label>
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
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  className="form-control"
                  type="password"
                  name="confirmPassword"
                  onChange={(e) =>
                    setFields({ ...fields, [e.target.name]: e.target.value })
                  }
                />
              </div>

              <div className="auth-btn-wrapper">
                <div className="form-group">
                  <button
                    type="submit"
                    className="btn btn-add-new"
                    disabled={!validateForm()}
                  >
                    {isLoading ? <LoadingSpinner /> : "Signup"}
                  </button>
                </div>
                <div className="form-group">
                  <Link
                    className="btn btn-edit"
                    to={"/login"}
                    style={isLoading ? { pointerEvents: "none" } : null}
                  >
                    Login
                  </Link>
                </div>
              </div>
            </section>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {user === null ? renderForm() : renderConfirmationForm()}
    </div>
  );
}
