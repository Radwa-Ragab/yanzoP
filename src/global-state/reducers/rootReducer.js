import { combineReducers } from "redux";
import authReducer from "./authReducer";
import agentRequestReducer from "./agentRequestReducer";
import searchResultSupplierReducer from "./searchResultSupplierReducer";
import courierSearchResultReducer from "./courierSearchResultReducer";
import requestDataReducer from "./requestDataReducer";
import ChangeTypeReducer from './changeTypeReducer'
import courierType from './courierType'
import quickupTypesReducer from './quickupTypesReducer'
const allReducers = combineReducers({
  auth: authReducer,
  searchData: agentRequestReducer,
  supplierRes: searchResultSupplierReducer,
  courierSearchResult: courierSearchResultReducer,
  requestData: requestDataReducer,
  type:ChangeTypeReducer,
  courierType : courierType,
  quickupTypes:quickupTypesReducer
});

export default allReducers;
