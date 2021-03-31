/* Main store content data to share with Components [state, props]
   and  triggers
*/
   
import { configureStore } from '@reduxjs/toolkit'
import accountsReducer from './Slices/accounts'

export default configureStore({
    reducer: {
        accounts: accountsReducer
    }
})
