import { AGENT_REQUEST,SUPPLIER_RES, AGENT_CO_REQUEST ,CHANGE, REQUEST_DATA} from "./actionTypes";

export const agentRequestData = (searchData) => {
  return {
    type: AGENT_REQUEST,
    payload: searchData,
  };
};


export const searchResultSuppliers = (searchData) => {
    return {
      type: SUPPLIER_RES,
      payload: searchData,
    };
  };
  

  export const clearRes = () => {
    return {
      type: SUPPLIER_RES,
      payload: {},
    };
  };

  export const agentCoRequest = (courierData) => {
    return {
      type: AGENT_CO_REQUEST,
      payload: courierData,
    };
  };
  
  export const getRequestData = (data) => {
    return {
      type: REQUEST_DATA,
      payload : data
    }
  }

  // export const callChange = (changeAlert) => {
  //   alert('called')
  //   return {
  //     type: CHANGE,
  //     payload: changeAlert,
  //   };
  // };