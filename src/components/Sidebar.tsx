import { IoMenu } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../store";
import { cn } from "../utils/helpers";
import { sidebarItems } from "../utils/constants";
import { toggleSidebar } from "../store/slices/global";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { sidebar } = useSelector((state: RootState) => state.global);

  const handleToggle = () => {
    dispatch(toggleSidebar());
  };

  return (
    <div
      className={cn("bg-main hidden w-20 flex-col transition-[width] md:flex", {
        "w-60": sidebar,
      })}
    >
      <div className="flex min-h-16 items-center justify-start bg-primary pl-6 transition-[width]">
        <IoMenu
          onClick={handleToggle}
          className="size-8 cursor-pointer text-white"
        />
      </div>
      <div className="relative z-30 hidden h-full bg-primary text-white transition-[width] md:block">
        <div className="relative z-20 h-full overflow-hidden">
          <ul className="flex w-full flex-col">
            {sidebarItems.map((item) => (
              <li
                key={item.id}
                className={cn(
                  "w-full hover:border-l-4 hover:border-white hover:bg-darkprimary",
                  {
                    "border-l-4 border-white bg-darkprimary":
                      item.link === pathname,
                  }
                )}
              >
                <Link
                  to={item.link}
                  className={cn("flex w-full items-center gap-5 p-3.5", {
                    "justify-center": !sidebar,
                    "justify-start": sidebar,
                  })}
                >
                  <img
                    src={item.icon}
                    alt="sidebar-icon"
                    className={cn("size-5", {
                      "size-6": !sidebar,
                    })}
                  />
                  {sidebar && (
                    <span className="flex-1 text-left font-semibold">
                      {item.name}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
