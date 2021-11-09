import { combineReducers } from 'redux'
import user, { IUser } from "./user"
import record, {IRecord} from "./record"
export interface StoreState {
  user: IUser,
  record: IRecord
}
export default combineReducers({
  user,
  record
})
