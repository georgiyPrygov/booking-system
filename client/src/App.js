import { BrowserRouter as Router } from "react-router-dom";
import UseRoutes from "./routes";
import { connect } from "react-redux";
import authSelectors from "./redux/auth/authSelectors";
import authOperations from "./redux/auth/authOperations";
import { useAuth } from "./hooks/auth.hook";
import React, { useEffect, useState } from "react";
import Header from "./components/Header/Header";
import SnackBar from "./components/SnackBar/SnackBar";

function App({ isAuthenticated, setIsAuthenticated, setUserId }) {
  const { token, userId } = useAuth();
  const [postMess, setPostMess] = useState();

  useEffect(() => {
    if (!!token && userId !== null) {
      setIsAuthenticated();
      setUserId(userId);
    }
  }, [token, setIsAuthenticated, userId, setUserId]);

  useEffect(() => {
    window.addEventListener("message", receiveMessage, false);
  }, []);

  let parentMessageEvent;

  function receiveMessage(event) {
    // Let's make sure the sender of this message is who we think it is.
    setPostMess('got post message')
    if (event.origin !== "https://agora-chalet.com") {
      setPostMess('wrong origin')
      return;
    }
    parentMessageEvent = event;
    sendResizeToParentWindow();
  }

  function sendResizeToParentWindow() {
    if (parentMessageEvent != undefined) {
      setPostMess('sent to parent')
      parentMessageEvent.source.postMessage(
        JSON.stringify({
          event: "resize",
          height: document.documentElement.offsetHeight,
        }),
        parentMessageEvent.origin
      );
    }
  }

  // create an Observer instance
  const resizeObserver = new ResizeObserver((entries) =>
    sendResizeToParentWindow()
  );

  // start observing a DOM node
  resizeObserver.observe(document.documentElement);


  return (
    <React.Fragment>
      <Router>
        {isAuthenticated && <Header />}
        {postMess}
        <UseRoutes isAuthenticated={isAuthenticated} />
      </Router>
      <SnackBar />
    </React.Fragment>
  );
}
const mapStateToProps = (state) => ({
  isAuthenticated: authSelectors.getIsAuthenticated(state),
});
const mapDispatchToProps = (dispatch) => ({
  setIsAuthenticated: () => dispatch(authOperations.setIsAuthenticated(true)),
  setUserId: (userId) => dispatch(authOperations.setUserId(userId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
