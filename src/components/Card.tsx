import type { ReactNode } from "react";
import NorthEast from "@mui/icons-material/NorthEast";
import SouthEast from "@mui/icons-material/SouthEast";

type Props = {
  label: string;
  value: string;
  sub: string;
  delta?: number;
  icon?: ReactNode;
  highlight?: boolean;
};

const Card = ({ label, value, sub, delta, icon, highlight }: Props) => {
  const down = (delta ?? 0) < 0;

  return (
    <div className={`flex flex-col gap-3.5 px-6 py-5 ${highlight ? "bg-ink" : "bg-white"}`}>
      <div className="flex items-center justify-between gap-2">
        <span className={`text-[13px] font-medium ${highlight ? "text-side" : "text-muted"}`}>
          {label}
        </span>
        {delta !== undefined ? (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-xs font-medium ${
              down ? "bg-neg-bg text-neg" : "bg-pos-bg text-pos"
            }`}
          >
            {down ? <SouthEast sx={{ fontSize: 12 }} /> : <NorthEast sx={{ fontSize: 12 }} />}
            {delta > 0 ? "+" : down ? "−" : ""}
            {Math.abs(delta)}%
          </span>
        ) : (
          <span className="text-accent">{icon}</span>
        )}
      </div>
      <span
        className={`truncate font-mono text-[32px] leading-none font-medium tracking-tighter ${
          highlight ? "text-accent" : "text-ink"
        }`}
      >
        {value}
      </span>
      <span className={`text-xs ${highlight ? "text-side" : "text-faint"}`}>{sub}</span>
    </div>
  );
};

export default Card;
