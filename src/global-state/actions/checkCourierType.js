import {IS_QUICKUP,IS_DEMAND} from "./actionTypes"

export const courierType = (courier) =>{
    return {
        type : IS_QUICKUP,
        payload : courier
    }
}

export const quickUpTypes = (id) =>{
    return {
        type : IS_DEMAND,
        payload : id
    }
}