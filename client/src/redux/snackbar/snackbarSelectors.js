
const getMessage = (state) => state.snackbar.snackbarData.message;
const getStatus = (state) => state.snackbar.snackbarData.status;
const getOpenedState = (state) => state.snackbar.snackbarData.isOpened;

  
  export default {
    getMessage,
    getStatus,
    getOpenedState
  };
  