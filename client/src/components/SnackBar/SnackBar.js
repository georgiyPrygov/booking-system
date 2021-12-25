import React from "react";
import { Snackbar, Alert } from "@mui/material";
import snackbarSelectors from "../../redux/snackbar/snackbarSelectors";
import { connect } from "react-redux";
import snackbarOperations from "../../redux/snackbar/snackbarOperations";

const SnackBar = ({ isOpened, message, status, setIsOpened }) => {

    const handleClose = () => {
        setIsOpened(false)
    }
  return (
    <Snackbar
      open={isOpened}
      autoHideDuration={6000}
      onClose={handleClose}
      message={message}
      anchorOrigin={{ vertical : 'top', horizontal: 'right' }}
    >
      <Alert onClose={handleClose} severity={status} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

const mapStateToProps = (state) => ({
  isOpened: snackbarSelectors.getOpenedState(state),
  message: snackbarSelectors.getMessage(state),
  status: snackbarSelectors.getStatus(state),
});
const mapDispatchToProps = (dispatch) => ({
    setIsOpened: (e) => dispatch(snackbarOperations.setIsOpened(e)),
  });
export default connect(mapStateToProps, mapDispatchToProps)(SnackBar);
