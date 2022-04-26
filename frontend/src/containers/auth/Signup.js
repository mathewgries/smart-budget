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
import { useFormFields } from "../../lib/hooksLib";
import Form from "react-bootstrap/Form";
import LoaderButton from "../../components/LoaderButton";

export default function Signup() {
  const dispatch = useDispatch();
  const [fields, handleFieldChange] = useFormFields({
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
      <Form onSubmit={handleConfirmationSubmit}>
        <Form.Group controlId="confirmationCode" size="lg">
          <Form.Label>Confirmation Code</Form.Label>
          <Form.Control
            autoFocus
            type="tel"
            onChange={handleFieldChange}
            value={fields.confirmationCode}
          />
          <Form.Text muted>Please check your email for the code.</Form.Text>
        </Form.Group>
        <LoaderButton
          block
          size="lg"
          type="submit"
          variant="success"
          isLoading={isLoading}
          disabled={!validateConfirmationForm()}
        >
          Verify
        </LoaderButton>
      </Form>
    );
  }

  function renderForm() {
    return (
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email" size="lg">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="password" size="lg">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="confirmPassword" size="lg">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            onChange={handleFieldChange}
            value={fields.confirmPassword}
          />
        </Form.Group>
        <LoaderButton
          block
          size="lg"
          type="submit"
          variant="success"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Signup
        </LoaderButton>
      </Form>
    );
  }

  return (
    <div className="Signup">
      {user === null ? renderForm() : renderConfirmationForm()}
    </div>
  );
}
