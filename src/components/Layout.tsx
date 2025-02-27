import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="w-[calc(100vw-320px)] max-h-screen overflow-hidden flex-1 flex flex-col">
        <Navbar />
        <div className="flex justify-between gap-2 px-4 py-2 bg-gray-100 flex-1 overflow-hidden">
          <div className="h-full w-full overflow-hidden">
            <Outlet />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Layout;
