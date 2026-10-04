import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { InventoryItem, Sale } from "../types";
import { getLocalData, getUserId, type PerUser } from "../lib/storage";
import { LOW_STOCK } from "../lib/ui";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export type MonthRow = { name: string } & Record<string, number | string>;

const ymd = (d: Date) => d.toISOString().split("T")[0];

const sum = (sales: Sale[]) =>
  sales.reduce((acc, s) => acc + Number(s.total_price), 0);

const getPercentageChange = (current: number, previous: number) => {
  if (previous === 0 && current === 0) return 0;
  if (previous === 0) return 100;
  return Number((((current - previous) / previous) * 100).toFixed(2));
};

const computeDashboard = () => {
  const userId = getUserId();
  const sales = (userId && getLocalData<PerUser<Sale>>("Sales")[userId]) || [];
  const inventory =
    (userId && getLocalData<PerUser<InventoryItem>>("Inventory")[userId]) || [];

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const lastMonth = new Date(year, month - 1, 1);

  const onDay = (d: Date) => sum(sales.filter((s) => s.sold_at.startsWith(ymd(d))));
  const inPeriod = (y: number, m?: number) =>
    sum(
      sales.filter((s) => {
        const d = new Date(s.sold_at.split("T")[0]);
        return d.getFullYear() === y && (m === undefined || d.getMonth() === m);
      })
    );

  const todayTotal = onDay(now);
  const monthTotal = inPeriod(year, month);
  const yearTotal = inPeriod(year);

  return {
    dashboardData: {
      total_customers: new Set(sales.map((s) => s.customer_name)).size,
      today_total: todayTotal,
      month_total: monthTotal,
      year_total: yearTotal,
      sales_today: getPercentageChange(todayTotal, onDay(yesterday)),
      monthly_sales: getPercentageChange(
        monthTotal,
        inPeriod(lastMonth.getFullYear(), lastMonth.getMonth())
      ),
      yearly_sales: getPercentageChange(yearTotal, inPeriod(year - 1)),
    },
    salesData: MONTHS.map(
      (name, i): MonthRow => ({
        name,
        [`yr${year - 1}`]: inPeriod(year - 1, i),
        [`yr${year}`]: inPeriod(year, i),
      })
    ),
    yearReport: { thisYear: `yr${year}`, lastYear: `yr${year - 1}` },
    lowStock: inventory
      .filter((i) => Number(i.quantity) <= LOW_STOCK)
      .sort((a, b) => Number(a.quantity) - Number(b.quantity))
      .slice(0, 3),
    recentSales: [...sales]
      .sort((a, b) => b.sold_at.localeCompare(a.sold_at))
      .slice(0, 3),
  };
};

type DashboardValue = ReturnType<typeof computeDashboard>;

const DashboardContext = createContext<DashboardValue | null>(null);

export const DashboardContextProvider = ({ children }: { children: ReactNode }) => {
  const value = useMemo(computeDashboard, []);

  return (
    <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used inside DashboardContextProvider");
  return ctx;
};
