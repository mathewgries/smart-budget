import React from 'react'

export default function InvestingBalance(props){
	const {accountBalance} = props.account

	return (
		<div className="component-container">
      <div className="component-wrapper">
        <div className="investing-balance-wrapper">
					Balance: {accountBalance}
				</div>
      </div>
    </div>
	)
}