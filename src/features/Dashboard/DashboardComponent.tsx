import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import PeopleAltOutlined from "@mui/icons-material/PeopleAltOutlined";
import Card from "../../components/Card";
import MonthlyReport from "./MonthlyReport";
import { useDashboard } from "../../context/DashboardContext";
import { LOW_STOCK, initials, peso } from "../../lib/ui";

const Panel = ({ title, to, children }: { title: string; to: string; children: ReactNode }) => (
  <section className="rounded-[14px] border border-line bg-white px-5 pt-5 pb-2">
    <header className="flex items-center justify-between pb-2">
      <h2 className="text-[15px] font-semibold">{title}</h2>
      <Link to={to} className="text-[13px] text-muted underline underline-offset-2 hover:text-ink">
        View all
      </Link>
    </header>
    {children}
  </section>
);

const Empty = ({ children }: { children: ReactNode }) => (
  <p className="border-t border-line py-6 text-center text-[13px] text-faint">{children}</p>
);

const DashboardComponent = () => {
  const { dashboardData: d, lowStock, recentSales } = useDashboard();

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-px overflow-hidden rounded-[14px] border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
        <Card
          highlight
          label="Total customers"
          value={d.total_customers.toLocaleString()}
          sub="unique buyers"
          icon={<PeopleAltOutlined sx={{ fontSize: 16 }} />}
        />
        <Card label="Sales today" value={peso(d.today_total)} delta={d.sales_today} sub="since yesterday" />
        <Card label="Monthly sales" value={peso(d.month_total)} delta={d.monthly_sales} sub="since last month" />
        <Card label="Yearly sales" value={peso(d.year_total)} delta={d.yearly_sales} sub="since last year" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <MonthlyReport />

        <div className="flex flex-col gap-5">
          <Panel title="Low stock" to="/inventory">
            {lowStock.length ? (
              lowStock.map((item) => {
                const q = Number(item.quantity);
                return (
                  <div key={item.itemNum} className="flex flex-col gap-2 border-t border-line py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{item.name}</p>
                        <p className="font-mono text-[11px] text-faint">{item.itemNum}</p>
                      </div>
                      <span className="font-mono text-xs font-medium whitespace-nowrap text-neg">
                        {q > 0 ? `${q} left` : "Out"}
                      </span>
                    </div>
                    <div className="h-1 rounded-full bg-[#edebe4]">
                      <div
                        className="h-1 rounded-full bg-neg"
                        style={{ width: `${Math.min(q / LOW_STOCK, 1) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <Empty>Everything is well stocked.</Empty>
            )}
          </Panel>

          <Panel title="Recent sales" to="/sales">
            {recentSales.length ? (
              recentSales.map((s) => (
                <div key={s.salesNum} className="flex items-center gap-3 border-t border-line py-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-paper text-xs font-semibold text-muted">
                    {initials(s.customer_name || "?")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{s.customer_name || "Walk-in"}</p>
                    <p className="font-mono text-[11px] text-faint">
                      {s.salesNum} · {s.sold_at.replace("T", " ")}
                    </p>
                  </div>
                  <span className="font-mono text-[13px] font-medium">{peso(Number(s.total_price))}</span>
                </div>
              ))
            ) : (
              <Empty>No sales recorded yet.</Empty>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
};

export default DashboardComponent;
