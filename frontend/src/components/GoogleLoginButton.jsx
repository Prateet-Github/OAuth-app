import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../contexts/AuthContext";

const GoogleLoginButton = () => {
  const { loginWithGoogle } = useAuth();

  return (
    <GoogleLogin
      onSuccess={loginWithGoogle}
      onError={() => console.log("Login Failed")}
    />
  );
};

export default GoogleLoginButton;