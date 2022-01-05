import React, { useRef, useState } from "react";
import { API } from "aws-amplify";
import Form from "react-bootstrap/Form";
import {useParams, useHistory } from "react-router-dom";
import { useFormFields } from "../../lib/hooksLib";
import LoaderButton from "../../components/LoaderButton";
import { onError } from "../../lib/errorLib";

export default function NewTransaction() {
  const history = useHistory();
	const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  // const [fields, handleFieldChange] = useFormFields({
  //   accountName: "",
  //   accountBalance: "",
  // });

  // function validateForm() {
  //   return fields.accountName.length > 0;
  // }

  // async function handleSubmit(event) {
  //   event.preventDefault();

  //   setIsLoading(true);

  //   try {
  //     await createAccount(fields);
  //     history.push("/");
  //   } catch (e) {
  //     onError(e);
  //     setIsLoading(false);
  //   }
  // }

  // function createAccount(account) {
  //   return API.post("smartbudget", "/accounts", {
  //     body: account,
  //   });
  // }

  return (
    <div className="NewAccount">
	
			{console.log(params)}
      {/* <Form onSubmit={handleSubmit}>
        <Form.Group controlId="accountName">
          <Form.Label>Account Name</Form.Label>
          <Form.Control
            type="text"
            value={fields.accountName}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="accountBalance">
          <Form.Label>Starting Balance</Form.Label>
          <Form.Control
            type="text"
            value={fields.accountBalance}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <LoaderButton
          block
          type="submit"
          size="lg"
          variant="primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Create
        </LoaderButton>
      </Form> */}
    </div>
  );
}
