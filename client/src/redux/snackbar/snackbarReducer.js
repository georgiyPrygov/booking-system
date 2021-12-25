import { combineReducers, createReducer } from "@reduxjs/toolkit";
import actions from './snackbarActions';

const initialState = {
    message: '',
    status: 'success',
    isOpened: false
}

const snackbarData = createReducer(initialState, {
    [actions.getData]: (state, { payload }) => ({...state, message: payload.message, status:payload.status}),
    [actions.setIsOpened]: (state, {payload}) => ({...state, isOpened: payload})
})


export default combineReducers({
    snackbarData,
  });
  