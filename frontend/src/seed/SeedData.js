import React, {useState} from "react";
import { API } from "aws-amplify";
import { amplifyClient } from "../api/amplifyClient";
import { onError } from "../lib/errorLib";
import LoadingSpinner from "../components/LoadingSpinner"

export default function SeedData(props) {
	const [isLoading, setIsLoading] = useState(false)

  async function runSeed() {
    try {
			setIsLoading(true)
      const user = await amplifyClient.auth.currentUserInfo();

      await API.post("smartbudget", "/seed_data", {
        body: {
          user: {
            id: user.id,
            ...user.attributes,
          },
        },
      });
    } catch (e) {
      onError(e);
    }
		setIsLoading(false)
  }

  return (
    <div className="page-container">
      <div className="page-wrapper">
        <div>
          <button className="btn btn-primary" onClick={runSeed}>
						{isLoading ? <LoadingSpinner/> : "Run Seed"}
          </button>
        </div>
      </div>
    </div>
  );
}
