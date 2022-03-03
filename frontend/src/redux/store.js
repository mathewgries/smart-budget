import { configureStore	} from '@reduxjs/toolkit'
import accountsReducer from '../redux/accountsSlice'

export default configureStore({
	reducer:{
		accounts: accountsReducer
	}
})