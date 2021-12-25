
const getUserId = (state) => state.user.userData.userId;
const getIsAuthenticated = (state) => state.user.userData.isAuthenticated

  export default {
    getUserId,
    getIsAuthenticated
  };
  