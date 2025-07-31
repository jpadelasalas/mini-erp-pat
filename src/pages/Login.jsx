import { useCallback, useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoginPage from "../features/LoginPage/LoginPage";
import BgLogin from "../assets/bg-login.jpg";
import RegisterPage from "../features/LoginPage/RegisterPage";
import useForm from "../hooks/useForm";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const dets = {
  username: "",
  password: "",
};

const validate = (dets) => {
  let errors = {};
  if (!dets.username) {
    errors.username = "Username is required";
  }
  if (!dets.password) {
    errors.password = "Password is required";
  }

  return errors;
};

const Login = () => {
  const navigate = useNavigate();

  const {
    values: userDetails,
    handleChange: loginChange,
    isError: loginError,
    handleSubmit: submitLogin,
    resetForm: resetLoginForm,
  } = useForm(dets, validate);
  const {
    values: registerDetails,
    handleChange: registerChange,
    isError: registerError,
    handleSubmit: submitRegister,
    resetForm: resetRegisterForm,
  } = useForm(dets, validate);

  const [isLogin, setIsLogin] = useState(false);
  const { login, register } = useAuth();

  const handleSwitchPage = useCallback(() => {
    setIsLogin((prev) => {
      prev ? resetLoginForm() : resetRegisterForm();
      return !prev;
    });
  }, [resetLoginForm, resetRegisterForm]);

  const handleLogin = (user) => {
    try {
      const isLogin = login(user);
      if (isLogin) {
        Swal.fire({
          icon: "success",
          title: "Login Successful",
        }).then((alert) => {
          if (alert.isConfirmed) {
            navigate("/dashboard");
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "Invalid username or password",
        });
        resetLoginForm();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message,
      });
    }
  };
  const handleRegister = (user) => {
    try {
      const isRegistered = register(user);
      if (isRegistered) {
        Swal.fire({
          icon: "success",
          title: "Registration Successful",
        });
        navigate("/dashboard");
      } else {
        Swal.fire({
          icon: "error",
          title: "Username is already taken.",
        });
        resetRegisterForm();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message,
      });
    }
  };

  return (
    <div className="h-screen md:p-2 flex items-center justify-center bg-[url('src/assets/bg-login.jpg')] bg-center bg-no-repeat bg-cover md:bg-gradient-to-br from-gray-100 to-gray-300 ">
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-1 ${
          !isLogin ? "grid-rows-[40%_60%]" : "grid-rows-[60%_40%]"
        } bg-gray-200 md:bg-white rounded-sm sm:rounded-lg shadow-md max-lg:h-[90%] max-md:h-auto w-3/4 lg:w-full max-w-5xl p-2 m-auto md:p-0 md:m-0 `}
      >
        <div className={`hidden md:block order-${isLogin ? 2 : 1}`}>
          <img
            src={BgLogin}
            className={`h-full w-full object-cover ${
              !isLogin
                ? "rounded-tl-lg lg:rounded-bl-lg lg:rounded-tr-none rounded-tr-lg"
                : "rounded-tr-lg lg:rounded-br-lg lg:rounded-tl-none rounded-tl-lg"
            } `}
          />
        </div>
        <div className={`p-1 sm:p-4 md:p-8 m-3 order-${isLogin ? 1 : 2}`}>
          {!isLogin ? (
            <LoginPage
              userDetails={userDetails}
              handleChange={loginChange}
              handleLogin={submitLogin(handleLogin)}
              handleSwitchPage={handleSwitchPage}
              loginError={loginError}
            />
          ) : (
            <RegisterPage
              userDetails={registerDetails}
              handleChange={registerChange}
              handleRegister={submitRegister(handleRegister)}
              handleSwitchPage={handleSwitchPage}
              registerError={registerError}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
