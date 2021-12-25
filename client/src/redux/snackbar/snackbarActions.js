import { createAction } from '@reduxjs/toolkit';


const getData = createAction('snackbar/getData');
const setIsOpened = createAction('snackbar/setIsOpened');

export default {
    getData,
    setIsOpened
}