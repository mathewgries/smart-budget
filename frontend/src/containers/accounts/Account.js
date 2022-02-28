import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API } from "aws-amplify";
import { onError } from "../../lib/errorLib";
import AccountItem from "./AccountItem";
import AccountEdit from "./AccountEdit";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

export default function Account() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [accountInfo, setAccountInfo] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
	const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    function loadAccountInfo() {
      return API.get("smartbudget", `/accounts/${id}`);
    }

    async function onLoad() {
      try {
        const accountInfo = await loadAccountInfo();
        setAccountInfo(accountInfo.find((item) => item.type === "ACCT#"));
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [id]);

  function toggleAccountEdit() {
    setIsEdit(!isEdit);
  }

	async function handleAccountUpdate(data){
		try{
			setIsSaving(true)
			await saveChanges(data) 
			setAccountInfo({
				...accountInfo,
				accountName: data.accountName,
				accountBalance: data.accountBalance
			})
		}catch(e){
			onError(e)
		}finally{
			setIsSaving(false)
			setIsEdit(false)
		}
	}

	function saveChanges({accountName, accountBalance}){
		return API.put("smartbudget", `/accounts/${id}`,{
			body: {
				accountName,
				accountBalance
			}
		});
	}

  return (
    <div>
      <div>
        <div>
          {!isEdit ? (
            <div>
              <AccountItem isLoading={isLoading} account={accountInfo} />
            </div>
          ) : (
            <div>
              <AccountEdit account={accountInfo} updateAccountInfo={handleAccountUpdate} isSaving={isSaving}/>
            </div>
          )}
        </div>
        <div className="form-group">
          <button className="btn btn-primary form-control" onClick={toggleAccountEdit}>
            {isEdit ? "Cancel" : "Edit"}
          </button>
        </div>
      </div>
      <Link to={`/accounts/${id}/transactions/new`} className="btn btn-primary">
        Add Transaction
      </Link>
    </div>
  );
}
