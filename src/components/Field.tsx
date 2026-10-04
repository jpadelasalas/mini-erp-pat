import type { ReactNode } from "react";
import ErrorOutline from "@mui/icons-material/ErrorOutline";

type Props = {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
};

const Field = ({ label, required, error, className = "", children }: Props) => (
  <label className={`flex flex-col gap-1.5 ${className}`}>
    <span className="text-[13px] font-medium text-muted">
      {label}
      {required && <span className="ml-0.5 text-neg">*</span>}
    </span>
    {children}
    {error && (
      <span className="flex items-center gap-1.5 text-xs text-neg">
        <ErrorOutline sx={{ fontSize: 14 }} />
        {error}
      </span>
    )}
  </label>
);

export default Field;
