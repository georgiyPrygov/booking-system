import snackbarActions from "./snackbarActions";

const snackbarRun = ({message, status}) => dispatch => {
   dispatch(snackbarActions.getData({message, status}))
}
const setIsOpened = (state) => dispatch => {
  dispatch(snackbarActions.setIsOpened(state))
}
export default {
  snackbarRun,
  setIsOpened,
}