import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";

const Layout = () => {
  const [titlePage, setTitlePage] = useState("");
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);

  useEffect(() => {
    const title = window.location.pathname.split("/")[1];
    setTitlePage(title.charAt(0).toUpperCase() + title.slice(1));
  }, []);

  return (
    <div className="flex space-x-4 h-screen">
      <Sidebar
        setTitlePage={setTitlePage}
        setIsOpenSidebar={setIsOpenSidebar}
        isOpenSidebar={isOpenSidebar}
      />
      <div className="flex-1 flex flex-col">
        <header className="p-4 border-b shadow md:hidden">
          <button
            onClick={() => setIsOpenSidebar(true)}
            className="text-gray-900 text-xl font-mono font-semibold"
          >
            ☰ {titlePage}
          </button>
        </header>

        <main className="p-6 overflow-y-auto">
          <h3 className="text-3xl font-semibold text-gray-900 font-mono hidden md:block">
            {titlePage}
          </h3>
          <div className="my-5 mx-0 md:mx-2 p-2 border-2 overflow-x-hidden border-gray-900 rounded-lg flex-grow-1 bg-violet-50">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
