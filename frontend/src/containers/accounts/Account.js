import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API } from "aws-amplify";
import { onError } from "../../lib/errorLib";
import AccountItem from "./AccountItem";
import Button from "react-bootstrap/Button";
import {Link} from 'react-router-dom'

export default function Account() {
  const { id } = useParams();
	const [isLoading, setIsLoading] = useState(true);
  const [accountInfo, setAccountInfo] = useState(null);

  useEffect(() => {
    function loadAccountInfo() {
      return API.get("smartbudget", `/accounts/${id}`);
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
  }, [id]);

	function renderAccountInfo(){
		const account = accountInfo.find(x => x.SK === `ACCT#${id}`)
		return (
			<div>
				<AccountItem props={account}/>
				<Link to={`/accounts/${id}/transactions/new`} className='btn btn-primary'>
					Add Transaction
				</Link>
			</div>
		);
	}

	function renderLoading(){
		return (
		
			<div>
				<p>Is Loading</p>
			</div>
		);
	}

  return (
		<div>
			{!isLoading ? renderAccountInfo(accountInfo) : renderLoading()}
		</div>
	);
}
