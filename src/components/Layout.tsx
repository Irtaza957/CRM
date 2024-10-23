import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="w-[calc(100vw-320px)] flex-1">
        <Navbar />
        <div className="flex justify-between gap-2 bg-gray-100 p-5">
          <div className="h-full w-full overflow-hidden">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
