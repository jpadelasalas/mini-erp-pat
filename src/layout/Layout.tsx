import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { getLocalData, getUserId } from "../lib/storage";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/inventory": "Inventory",
  "/sales": "Sales",
  "/employees": "Employees",
};

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
};

const dateLabel = () => {
  const d = new Date();
  const weekday = d.toLocaleDateString("en-GB", { weekday: "short" });
  const date = d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return `${weekday} · ${date}`;
};

const Layout = () => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const { pathname } = useLocation();
  const { user } = useAuth();
  const pageTitle = titles[pathname] ?? "";
  const heading =
    pathname === "/dashboard" ? `${greeting()}, ${user?.username}` : pageTitle;

  useEffect(() => {
    const user = getUserId();
    if (!user) return;
    const docno = getLocalData<Record<string, unknown>>("docno");

    if (!docno[user]) {
      docno[user] = {
        inventory: {
          docnum: 1,
          prefix: "IV",
          length: 5,
        },
        sales: {
          docnum: 1,
          prefix: "S",
          length: 5,
        },
        employees: {
          docnum: 1,
          prefix: "E",
          length: 4,
        },
      };

      localStorage.setItem("docno", JSON.stringify(docno));
    }
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-paper">
      <Sidebar isOpen={isOpenSidebar} onClose={() => setIsOpenSidebar(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-line bg-white px-4 py-3 md:hidden">
          <button
            onClick={() => setIsOpenSidebar(true)}
            aria-label="Open menu"
            className="grid size-9 cursor-pointer place-items-center rounded-lg border border-line"
          >
            <MenuIcon sx={{ fontSize: 18 }} />
          </button>
          <span className="font-semibold">{pageTitle}</span>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-10 md:py-8">
          <p className="font-mono text-xs tracking-wider text-faint uppercase">
            {dateLabel()}
          </p>
          <h1 className="font-display text-4xl tracking-tight md:text-[44px]">
            {heading}
          </h1>
          <div className="mt-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
