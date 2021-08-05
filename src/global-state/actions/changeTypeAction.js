import { ORDER_TYPE} from "./actionTypes";

export const changeOrderType = (data) => {
    return {
      type: ORDER_TYPE,
      payload: data,
    };
  };