import { NavLink } from "react-router-dom";
import GridViewOutlined from "@mui/icons-material/GridViewOutlined";
import Inventory2Outlined from "@mui/icons-material/Inventory2Outlined";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import PeopleAltOutlined from "@mui/icons-material/PeopleAltOutlined";
import LogoutOutlined from "@mui/icons-material/LogoutOutlined";
import { useAuth } from "../context/AuthContext";
import { initials } from "../lib/ui";

const menuItems = [
  { label: "Dashboard", route: "/dashboard", Icon: GridViewOutlined },
  { label: "Inventory", route: "/inventory", Icon: Inventory2Outlined },
  { label: "Sales", route: "/sales", Icon: ReceiptLongOutlined },
  { label: "Employees", route: "/employees", Icon: PeopleAltOutlined },
];

type Props = { isOpen: boolean; onClose: () => void };

const Sidebar = ({ isOpen, onClose }: Props) => {
  const { user, logout } = useAuth();
  const username = user?.username ?? "";

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-ink/50 md:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 shrink-0 flex-col gap-8 bg-ink px-4 py-6 transition-transform duration-300 md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2.5 px-2">
          <span className="grid size-7 place-items-center rounded-md bg-accent font-mono text-base font-bold text-ink">
            m
          </span>
          <span className="text-base font-semibold tracking-tight text-white">
            Mini ERP
          </span>
        </div>

        <nav className="flex flex-col gap-0.5">
          <span className="mb-2 px-2 font-mono text-[11px] tracking-widest text-side/70">
            WORKSPACE
          </span>
          {menuItems.map(({ label, route, Icon }) => (
            <NavLink
              key={route}
              to={route}
              onClick={onClose}
              className={({ isActive }) =>
                `flex h-10 items-center gap-3 rounded-lg px-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-ink-2 text-white"
                    : "text-side hover:bg-ink-2/60 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon sx={{ fontSize: 18 }} />
                  <span className="flex-1">{label}</span>
                  {isActive && <span className="size-1.5 rounded-full bg-accent" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto flex items-center gap-2.5 rounded-xl border border-white/10 px-2.5 py-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/10 text-xs font-semibold text-accent">
            {initials(username)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-white">{username}</p>
            <p className="text-xs text-side">Signed in</p>
          </div>
          <button
            onClick={logout}
            aria-label="Log out"
            className="grid size-8 cursor-pointer place-items-center rounded-lg text-side transition-colors hover:bg-ink-2 hover:text-white"
          >
            <LogoutOutlined sx={{ fontSize: 16 }} />
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
