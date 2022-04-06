import React, { useState } from "react";
import { amplifyClient } from "../../api/amplifyClient";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { onError } from "../../lib/errorLib";
import { lastRouteUpdated } from "../../redux/history/historySlice";
import { useAppContext } from "../../lib/contextLib";
import { useFormFields } from "../../lib/hooksLib";
import Form from "react-bootstrap/Form";
import LoaderButton from "../../components/LoaderButton";
import "./style.css";

export default function Signup() {
  const dispatch = useDispatch();
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
    confirmPassword: "",
    confirmationCode: "",
  });
  const history = useHistory();
  const [newUser, setNewUser] = useState(null);
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);

    try {
      const newUser = await amplifyClient.auth.signUp({
        username: fields.email,
        password: fields.password,
      });
      dispatch(lastRouteUpdated("/signup"));
      setNewUser(newUser);
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
    setIsLoading(false);
  }

  async function handleConfirmationSubmit(event) {
    event.preventDefault();

    try {
      setIsLoading(true);

      await amplifyClient.auth.confirmSignUp({
        email: fields.email,
        confirmationCode: fields.confirmationCode,
      });
      await amplifyClient.auth.signIn({
        username: fields.email,
        password: fields.password,
      });
      userHasAuthenticated(true);
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
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
      {newUser === null ? renderForm() : renderConfirmationForm()}
    </div>
  );
}
