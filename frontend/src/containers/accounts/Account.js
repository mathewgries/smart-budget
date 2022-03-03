import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API } from "aws-amplify";
import { onError } from "../../lib/errorLib";
import AccountItem from "./AccountItem";
import AccountEdit from "./AccountEdit";
import NewTransaction from "../transactions/NewTransactions";

export default function Account() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [accountInfo, setAccountInfo] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isNewTransaction, setIsNewTransaction] = useState(false);

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
  }, [id, isNewTransaction]);

  function toggleAccountEdit() {
    setIsEdit(prev => !prev);
  }

  function toggleIsNewTransaction() {
    setIsNewTransaction(prev => !prev);
  }

  async function handleAccountUpdate(data) {
    try {
      setIsSaving(true);
      await saveChanges(data);
      setAccountInfo({
        ...accountInfo,
        accountName: data.accountName,
        accountBalance: data.accountBalance,
      });
    } catch (e) {
      onError(e);
    } finally {
      setIsSaving(false);
      setIsEdit(false);
    }
  }

  function saveChanges({ accountName, accountBalance }) {
    return API.put("smartbudget", `/accounts/${id}`, {
      body: {
        accountName,
        accountBalance,
      },
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
              <AccountEdit
                account={accountInfo}
                updateAccountInfo={handleAccountUpdate}
                isSaving={isSaving}
              />
            </div>
          )}
        </div>
        <div className="form-group">
          <button
            className="btn btn-primary form-control"
            onClick={toggleAccountEdit}
						disabled={isLoading || isSaving || isNewTransaction}
          >
            {isEdit ? "Cancel" : "Edit Account"}
          </button>
        </div>
      </div>
      <div>
        <div className="form-group">
          <button
            className="btn btn-success form-control"
            onClick={toggleIsNewTransaction}
						disabled={isLoading || isSaving || isEdit}
          >
            {isNewTransaction ? "Cancel" : "Add Transaction"}
          </button>
        </div>
        <div>
          {isNewTransaction && (
            <NewTransaction
              accountInfo={accountInfo}
              toggleIsNewTransaction={toggleIsNewTransaction}
            />
          )}
        </div>
      </div>
    </div>
  );
}
