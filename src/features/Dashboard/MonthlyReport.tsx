import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDashboard } from "../../context/DashboardContext";
import { compact, peso } from "../../lib/ui";

// recharts draws SVG attributes, so these mirror the @theme tokens in index.css
const INK = "#141416";
const ACCENT = "#c8f04d";
const LAST_YEAR = "#d6d4cb";
const tick = { fontFamily: "JetBrains Mono", fontSize: 11, fill: "#74726a" };

const MonthlyReport = () => {
  const { salesData, yearReport } = useDashboard();
  const currentMonth = new Date().getMonth();
  const thisYear = yearReport.thisYear.slice(2);
  const lastYear = yearReport.lastYear.slice(2);

  return (
    <section className="flex min-h-[420px] flex-col gap-5 rounded-[14px] border border-line bg-white p-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Monthly report</h2>
          <p className="text-[13px] text-faint">
            Revenue per month, {thisYear} vs {lastYear}
          </p>
        </div>
        <div className="flex gap-4 font-mono text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-xs bg-ink" />
            {thisYear}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-xs" style={{ background: LAST_YEAR }} />
            {lastYear}
          </span>
        </div>
      </header>

      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
          <BarChart data={salesData} barGap={4} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#eceae3" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tick={tick} />
            <YAxis tickLine={false} axisLine={false} width={44} tick={tick} tickFormatter={compact} />
            <Tooltip
              cursor={{ fill: "#f4f3ee" }}
              formatter={(v) => peso(Number(v))}
              contentStyle={{ borderRadius: 10, border: "1px solid #e4e2da", fontFamily: "Geist" }}
            />
            <Bar dataKey={yearReport.lastYear} name={lastYear} fill={LAST_YEAR} radius={[3, 3, 0, 0]} maxBarSize={14} />
            <Bar dataKey={yearReport.thisYear} name={thisYear} radius={[3, 3, 0, 0]} maxBarSize={14}>
              {salesData.map((row, i) => (
                <Cell
                  key={row.name}
                  fill={i === currentMonth ? ACCENT : INK}
                  stroke={i === currentMonth ? INK : undefined}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default MonthlyReport;
