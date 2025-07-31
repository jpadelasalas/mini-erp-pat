import * as MUIIcons from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    route: "/dashboard",
    icon: "Dashboard",
  },
  {
    label: "Inventory",
    route: "/inventory",
    icon: "Inventory",
  },
  {
    label: "Sales",
    route: "/sales",
    icon: "PointOfSale",
  },
  {
    label: "Employees",
    route: "/employees",
    icon: "Badge",
  },
  {
    label: "Settings",
    route: "/settings",
    icon: "Settings",
  },
];

const Sidebar = ({ setTitlePage, setIsOpenSidebar, isOpenSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleClickNavs = (item) => {
    setTitlePage(item.label);
    navigate(item.route);
    setIsOpenSidebar(false);
  };
  return (
    <>
      {isOpenSidebar && (
        <div
          className="fixed inset-0 bg-black w-screen bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpenSidebar(false)}
        ></div>
      )}

      <aside
        className={`fixed z-50 inset-y-0 left-0 lg:w-64 w-55 bg-violet-300 border-r shadow-md px-4 py-2 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:block overflow-y-auto h-screen ${
          isOpenSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h3 className="my-2 mb-5 text-3xl font-semibold text-gray-900 font-mono">
          Mini ERP
        </h3>

        <nav className="flex flex-col justify-between h-[calc(100vh-5.5rem)] text-black">
          <div className="flex flex-col space-y-5">
            {menuItems.map((item, index) => {
              const Icon = MUIIcons[item.icon];
              return (
                <span
                  key={index}
                  className="flex gap-2 ml-3 cursor-pointer hover:text-gray-600 active:text-gray-800"
                  onClick={() => handleClickNavs(item)}
                >
                  <Icon />
                  {item.label}
                </span>
              );
            })}
          </div>

          <span
            className="ml-3 mt-4 cursor-pointer gap-2 flex hover:text-gray-600 active:text-gray-800"
            onClick={logout}
          >
            <MUIIcons.Logout />
            Logout
          </span>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
