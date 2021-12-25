import { createAction } from '@reduxjs/toolkit';

const setIsAuthenticated = createAction('auth/setIsAuthenticated');
const setUserId = createAction('auth/setUserId');


export default {
    setIsAuthenticated,
    setUserId
}