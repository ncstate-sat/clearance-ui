import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Heading } from "evergreen-ui";
import Layout from "./Layout";
import { refreshToken, signInWithGoogle } from "../store/slices/auth";
import getEnvVariable from '../utils/getEnvVariable'

const Auth = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.auth.token !== null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshToken());

    if (!isLoggedIn) {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: getEnvVariable('VITE_GOOGLE_IDENTITY_CLIENT_ID'),
          callback: (response) =>
            dispatch(signInWithGoogle(response["credential"])),
        });
        window.google.accounts.id.renderButton(
          document.getElementById("login-button-div"),
          { theme: "outline", size: "large" }
        );
      } else {
        window.location.reload()
      }
    }
  }, [isLoggedIn]);

  if (isLoggedIn) {
    return children;
  } else {
    return (
      <Layout title="Login">
        <Heading size={800}>Login</Heading>
        <div id="login-button-div"></div>
      </Layout>
    );
  }
};

export default Auth;
