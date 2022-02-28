import React, { useRef, useState, useEffect } from "react";
import { API } from "aws-amplify";
import Form from "react-bootstrap/Form";
import { useParams, useHistory } from "react-router-dom";
import { useFormFields } from "../../lib/hooksLib";
import LoaderButton from "../../components/LoaderButton";
import { onError } from "../../lib/errorLib";

export default function NewTransaction() {
  const history = useHistory();
  const params = useParams();
  const [accountInfo, setAccountInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    function loadAccountInfo() {
      return API.get("smartbudget", `/accounts/${params.id}`);
    }

    async function onLoad() {
      try {
        const accountInfo = await loadAccountInfo();
        setAccountInfo(accountInfo);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, []);

  return (
    <div className="NewAccount">
      <div>
        <pre>{JSON.stringify(accountInfo, null, 2)}</pre>
      </div>
      
    </div>
  );
}
