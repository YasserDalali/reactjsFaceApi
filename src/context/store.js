import { legacy_createStore as createStore, combineReducers } from "redux";
import employeeReducer from "./reducers/employeeReducer";
import leaveRequestReducer from "./reducers/leaveRequestReducer";
import attendanceReducer from "./reducers/attendanceReducer";
import reportReducer from "./reducers/reportReducer";

const rootReducer = combineReducers({
  employees: employeeReducer,
  leaveRequests: leaveRequestReducer,
  attendance: attendanceReducer,
  reports: reportReducer,
});

const store = createStore(rootReducer);

export default store;
