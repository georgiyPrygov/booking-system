import React, { useState } from "react";
import axios from "axios";
import { connect } from "react-redux";
import authOperations from "../../../redux/auth/authOperations";
import { useAuth } from "../../../hooks/auth.hook";
import "./AuthForm.scss";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
} from "@mui/material";
import snackbarOperations from "../../../redux/snackbar/snackbarOperations";

const AuthForm = ({ setIsAuthenticated, setUserId, snackbarRun, setIsOpened }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setLoading] = useState(false);
  const pathname = window.location.pathname;
  const { login } = useAuth();

  const changeHandler = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const registerHandler = () => {
    setLoading(true);
    axios
      .post("/api/auth/register", { ...form })
      .then((response) => {
        setIsOpened(true)
        snackbarRun({message: response.data.message, status: 'success'});
      })
      .catch((e) => {
        setLoading(false);
        setIsOpened(true)
        snackbarRun({message: e.message, status: 'error'});
      });
  };
  const loginHandler = () => {
    setLoading(true);
    axios
      .post("/api/auth/login", { ...form })
      .then((response) => {
        login(response.data.token, response.data.userId);
        setIsOpened(true)
        snackbarRun({message: response.data.message, status: 'success'});
        setIsAuthenticated();
        setUserId(response.data.userId);
      })
      .catch((e) => {
        setLoading(false);
        setIsOpened(true)
        snackbarRun({message: e.message, status: 'error'});
      });
  };

  const handleSubmit = (e) => {
        e.preventDefault();
        pathname === "/login" ? loginHandler() : registerHandler();
  }

  return (
    <Container>
      <Box>
        <Card className="auth-card">
        <form onSubmit={handleSubmit}>
          <CardContent className="card-content">
            {pathname === "/login" ? (
              <Typography variant="h4" component="h4" gutterBottom>
                Войдите в аккаунт
              </Typography>
            ) : (
              <Typography variant="h4" component="h4" gutterBottom>
                Регистрация
              </Typography>
            )}
              <TextField
                required
                id="email"
                label="Email"
                name="email"
                placeholder="Введите email"
                onChange={changeHandler}
                value={form.email}
                fullWidth
                margin="normal"
                size="small"
              />
              <TextField
                required
                id="password"
                label="Password"
                name="password"
                placeholder="Введите пароль"
                onChange={changeHandler}
                value={form.password}
                type="password"
                fullWidth
                margin="normal"
                size="small"
              />
          </CardContent>
          <CardActions className="card-actions">
            {pathname === "/login" ? (
              <Button variant="contained" type="submit">
                Войти
              </Button>
            ) : (
              <Button variant="contained" type="submit">
                Регистрация
              </Button>
            )}
          </CardActions>
          </form>
          {isLoading && <div className="loader-container"><CircularProgress/></div>}
        </Card>
      </Box>
    </Container>
  );
};
const mapDispatchToProps = (dispatch) => ({
  setIsAuthenticated: () => dispatch(authOperations.setIsAuthenticated(true)),
  setUserId: (userId) => dispatch(authOperations.setUserId(userId)),
  snackbarRun: (e) => dispatch(snackbarOperations.snackbarRun(e)),
  setIsOpened: (e) => dispatch(snackbarOperations.setIsOpened(e))
});
export default connect(null, mapDispatchToProps)(AuthForm);
