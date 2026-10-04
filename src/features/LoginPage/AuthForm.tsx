import type { ChangeEvent, FormEvent } from "react";
import ArrowForward from "@mui/icons-material/ArrowForward";
import Field from "../../components/Field";
import type { Credentials } from "../../context/AuthContext";
import type { FormErrors } from "../../types";
import { inputClass } from "../../lib/ui";

type Props = {
  mode: "login" | "register";
  values: Credentials;
  errors: FormErrors<Credentials>;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent) => void;
  onSwitch: () => void;
};

const AuthForm = ({ mode, values, errors, onChange, onSubmit, onSwitch }: Props) => {
  const isLogin = mode === "login";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-7">
      <div className="flex flex-col gap-1.5">
        <h2 className="font-display text-[44px] leading-none tracking-tight">
          {isLogin ? "Welcome back" : "Create account"}
        </h2>
        <p className="text-[15px] text-muted">
          {isLogin ? "Log in to your workspace to continue." : "Set up a workspace in a few seconds."}
        </p>
      </div>

      <div className="flex flex-col gap-4.5">
        <Field label="Username" error={errors.username}>
          <input
            name="username"
            autoComplete="username"
            className={`${inputClass(errors.username)} h-[46px] text-[15px]`}
            value={values.username}
            onChange={onChange}
          />
        </Field>
        <Field label="Password" error={errors.password}>
          <input
            type="password"
            name="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            className={`${inputClass(errors.password)} h-[46px] text-[15px]`}
            value={values.password}
            onChange={onChange}
          />
        </Field>
      </div>

      <button
        type="submit"
        className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-ink text-[15px] font-medium text-white transition-colors hover:bg-ink-2"
      >
        {isLogin ? "Log in" : "Create account"}
        <ArrowForward sx={{ fontSize: 16 }} className="text-accent" />
      </button>

      <p className="text-center text-sm text-muted">
        {isLogin ? "Don't have an account yet? " : "Already have an account? "}
        <button
          type="button"
          onClick={onSwitch}
          className="cursor-pointer font-medium text-ink underline underline-offset-2"
        >
          {isLogin ? "Register" : "Log in"}
        </button>
      </p>
    </form>
  );
};

export default AuthForm;
