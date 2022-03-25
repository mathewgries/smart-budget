import React from 'react'
import {useParams} from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectInvestingAccountById} from '../../../redux/investing/investingAccountsSlice'

export default function InvestingBalance(props){
	const {id} = useParams()
	const account = useSelector((state) => selectInvestingAccountById(state, id))

	return (
		<div className="component-container">
      <div className="component-wrapper">
        <div className="investing-balance-wrapper">
					Balance: {account.accountBalance}
				</div>
      </div>
    </div>
	)
}