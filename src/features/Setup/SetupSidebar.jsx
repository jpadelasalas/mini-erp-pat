import React from "react";

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
    label: "Setup",
    route: "/setup",
    icon: "Settings",
  },
];

const SetupSidebar = () => {
  return (
    <aside
      className={`fixed inset-y-0 left-0 lg:w-64 w-55 border-r shadow-md  transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:block overflow-y-auto h-full`}
    >
      <nav className="flex flex-col h-full text-black px-4 py-2 ">
        <div className="flex flex-col space-y-5">
          {menuItems.map((item, index) => {
            return (
              <span
                key={index}
                className="flex gap-2 ml-3 cursor-pointer hover:text-gray-600 active:text-gray-800 "
                //   onClick={() => handleClickNavs(item)}
              >
                {/* <Icon /> */}
                {item.label}
              </span>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};

export default SetupSidebar;
