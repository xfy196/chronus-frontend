import { combineReducers } from 'redux'
import user, { IUser } from "./user"
export interface StoreState {
  user: IUser
}
export default combineReducers({
  user
})
