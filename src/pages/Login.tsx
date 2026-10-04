import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth, type Credentials } from "../context/AuthContext";
import AuthForm from "../features/LoginPage/AuthForm";
import useForm from "../hooks/useForm";
import type { FormErrors } from "../types";

const dets: Credentials = {
  username: "",
  password: "",
};

const validate = (dets: Credentials) => {
  const errors: FormErrors<Credentials> = {};
  if (!dets.username) {
    errors.username = "Username is required";
  }
  if (!dets.password) {
    errors.password = "Password is required";
  }

  return errors;
};

const errorText = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

const Login = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const { values, handleChange, isError, handleSubmit, resetForm } = useForm(dets, validate);

  const handleSwitchPage = () => {
    resetForm();
    setMode((m) => (m === "login" ? "register" : "login"));
  };

  const handleLogin = (user: Credentials) => {
    try {
      if (login(user)) {
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
        resetForm();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: errorText(error),
      });
    }
  };

  const handleRegister = (user: Credentials) => {
    try {
      if (register(user)) {
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
        resetForm();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: errorText(error),
      });
    }
  };

  return (
    <div className="grid min-h-screen bg-paper lg:grid-cols-[minmax(0,620px)_1fr]">
      <aside className="hidden flex-col justify-between bg-ink p-14 lg:flex">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-[7px] bg-accent font-mono text-lg font-bold text-ink">
            m
          </span>
          <span className="text-lg font-semibold text-white">Mini ERP</span>
        </div>

        <div className="flex flex-col gap-5">
          <p className="font-display text-[56px] leading-[1.05] tracking-tight text-white">
            Stock, sales and people —
            <br />
            kept in one quiet place.
          </p>
          <p className="max-w-[420px] text-[15px] leading-relaxed text-side">
            A small ERP for small shops. Track inventory, record every sale and
            keep your team list current.
          </p>
        </div>

        <ul className="flex gap-10 border-t border-white/10 pt-6 font-mono text-xs tracking-wider text-side uppercase">
          <li>Inventory</li>
          <li className="text-accent">Sales</li>
          <li>Employees</li>
        </ul>
      </aside>

      <main className="flex items-center justify-center p-6">
        <div className="w-full max-w-[380px]">
          <AuthForm
            mode={mode}
            values={values}
            errors={isError}
            onChange={handleChange}
            onSubmit={handleSubmit(mode === "login" ? handleLogin : handleRegister)}
            onSwitch={handleSwitchPage}
          />
        </div>
      </main>
    </div>
  );
};

export default Login;
