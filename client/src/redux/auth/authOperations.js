import authActions from "./authActions"

const setIsAuthenticated = value => dispatch => {
    dispatch(authActions.setIsAuthenticated(value));
}
const setUserId = id => dispatch => {
    dispatch(authActions.setUserId(id));
}
export default {
    setIsAuthenticated,
    setUserId
}