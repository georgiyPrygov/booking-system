import { combineReducers, createReducer } from "@reduxjs/toolkit";
import actions from './authActions';

const userInitialState = {
    isAuthenticated: false,
    userId: null
}




const userData = createReducer(userInitialState, {
    [actions.setIsAuthenticated]: (state, { payload }) => ({...state, isAuthenticated: payload}),
    [actions.setUserId]: (state, { payload }) => ({...state, userId: payload})
})


export default combineReducers({
  userData,
  });
  