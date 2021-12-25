import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import authOperations from "../../redux/auth/authOperations";
import { useAuth } from "../../hooks/auth.hook";
import './Header.scss';
import {
  Box,
  Button,
  Typography,
  AppBar,
  Toolbar,
} from "@mui/material";

const Header = ({ setIsAuthenticated }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
  };
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <NavLink to="/calendar" className="brand-logo">
              Agora bookings
            </NavLink>
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setIsAuthenticated: (e) => dispatch(authOperations.setIsAuthenticated(e)),
});

export default connect(null, mapDispatchToProps)(Header);
