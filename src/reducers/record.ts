import {
  SET_END_TIME,
  SET_ID,
  SET_IS_PAUSE,
  SET_NAME,
  SET_START_TIME,
  SET_TIME,
  SET_TIMEOUT,
} from "../constants/record";

export interface IRecord {
  time: number;
  startTime: number;
  endTime: number;
  isPause: boolean;
  name: string;
  id: number;
  timeoutfn: number;
}
const INITIAL_STATE = {
  time: 0,
  startTime: 0,
  endTime: 0,
  isPause: false,
  id: 0,
  name: "",
  timeoutfn: 0,
};
export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_TIME:
      return {
        ...state,
        time:
          action.data || action.data === 0 ? action.data : 1000 + state.time,
      };
    case SET_START_TIME:
      return {
        ...state,
        startTime: action.data,
      };
    case SET_END_TIME:
      return {
        ...state,
        endTime: action.data,
      };
    case SET_IS_PAUSE:
      return {
        ...state,
        isPause: action.data,
      };
    case SET_NAME:
      return {
        ...state,
        name: action.data,
      };
    case SET_ID:
      return {
        ...state,
        id: action.data,
      };
    case SET_TIMEOUT:
      return {
        ...state,
        timeoutfn: action.data,
      };
    default:
      return state;
  }
}
