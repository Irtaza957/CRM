import { IoMenu } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import { RootState } from "../store";
import { cn } from "../utils/helpers";
import { sidebarItems } from "../utils/constants";
import { toggleSidebar } from "../store/slices/global";
import { RiArrowDropDownLine } from "react-icons/ri";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { sidebar } = useSelector((state: RootState) => state.global);
  const [openPanels, setOpenPanels] = useState<Record<string, boolean>>({});

  const handleToggle = () => {
    dispatch(toggleSidebar());
  };

  const handleAppPanelClick = (
    e: React.MouseEvent,
    item: (typeof sidebarItems)[0]
  ) => {
    if (item.link === "#") {
      e.preventDefault();
      setOpenPanels((prev) => ({
        ...prev,
        [item.id]: !prev[item.id],
      }));
    }
  };

  const isParentActive = (item: (typeof sidebarItems)[0]) => {
    return item.subItems?.length
      ? item.subItems?.some((subItem) => pathname.startsWith(subItem.link))
      : pathname.startsWith(item.link);
  };

  return (
    <div
      className={cn(
        "bg-main hidden max-h-screen w-20 flex-col overflow-y-auto transition-[width] md:flex",
        {
          "w-68": sidebar,
        }
      )}
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
              <li key={item.id} className="w-full">
                <Link
                  to={item.link}
                  onClick={(e) => handleAppPanelClick(e, item)}
                  className={cn(
                    "flex w-full items-center gap-5 p-3.5 hover:border-l-4 hover:border-white hover:bg-darkprimary",
                    {
                      "justify-center": !sidebar,
                      "justify-start": sidebar,
                      "border-l-4 border-white bg-darkprimary":
                        isParentActive(item),
                    }
                  )}
                >
                  <img
                    src={item.icon}
                    alt="sidebar-icon"
                    className={cn("size-5", {
                      "size-6": !sidebar,
                    })}
                  />
                  {sidebar && (
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="flex-1 text-left font-semibold whitespace-nowrap">
                        {item.name}
                      </span>
                      {item.subItems?.length && (
                        <RiArrowDropDownLine
                          className={`size-8 ${openPanels[item.id] ? "rotate-180" : "rotate-0"}`}
                        />
                      )}
                    </div>
                  )}
                </Link>
                {item.subItems?.length && sidebar && openPanels[item.id] && (
                  <ul className="bg-darkprimary/50">
                    {item.subItems?.map((subItem) => (
                      <li
                        key={subItem.id}
                        className={cn(
                          "hover:border-l-4 hover:border-white hover:bg-darkprimary/70",
                          {
                            "border-l-4 border-white bg-darkprimary":
                              pathname === subItem.link,
                          }
                        )}
                      >
                        <Link
                          to={subItem.link}
                          className="flex items-center gap-3 p-3.5 pl-12"
                        >
                          <img
                            src={subItem.icon}
                            alt="sidebar-icon"
                            className="size-5"
                          />
                          <span className="text-sm font-semibold">
                            {subItem.name}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
