import { BrowserRouter as Router } from 'react-router-dom';
import UseRoutes from './routes';
import { connect } from 'react-redux'
import authSelectors from './redux/auth/authSelectors';
import authOperations from './redux/auth/authOperations';
import { useAuth } from './hooks/auth.hook'
import React, { useEffect } from 'react';
import Header from './components/Header/Header';
import SnackBar from './components/SnackBar/SnackBar';

function App({isAuthenticated, setIsAuthenticated, setUserId}) {

  const {token, userId} = useAuth()

  useEffect(() => {
    if(!!token && userId !== null) {
      setIsAuthenticated()
      setUserId(userId)
    }
  }, [token, setIsAuthenticated, userId, setUserId])

  return (
    <React.Fragment>
    <Router>
      {isAuthenticated && <Header/>}
       <UseRoutes isAuthenticated={isAuthenticated}/>
    </Router>
    <SnackBar/>
    </React.Fragment>
  );
}
const mapStateToProps = state => ({
 isAuthenticated: authSelectors.getIsAuthenticated(state)
})
const mapDispatchToProps = (dispatch) => ({
  setIsAuthenticated: () => dispatch(authOperations.setIsAuthenticated(true)),
  setUserId: (userId) => dispatch(authOperations.setUserId(userId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
