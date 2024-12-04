import { RootState } from "../store";
import Logo from "../assets/img/logo.svg";
import CustomDatePicker from "./ui/CustomDatePicker";

import { useRef, useState } from "react";
import { GoBell } from "react-icons/go";
import { BsGear } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineMessage } from "react-icons/md";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { setDate } from "../store/slices/app";
import dayjs from "dayjs";
import { useNavigate, useLocation } from "react-router-dom";
import { useOnClickOutside } from "../hooks/useOnClickOutside";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [isLogout, setIsLogout] = useState(false);

  const { user } = useSelector((state: RootState) => state.global);
  const { date } = useSelector((state: RootState) => state.app);
  const userRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(userRef, () => setIsLogout(false));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSetDate = (date: string | Date) => {
    dispatch(setDate(date));
  };

  const handleLogout = () => {
    ["date", "user", "sidebar"].forEach((key) => {
      localStorage.removeItem(key);
    });
    navigate("/login");
  };

  const incrementDate = (e: React.MouseEvent<SVGAElement>) => {
    e.stopPropagation();
    const newDate = dayjs(date || new Date())
      .add(1, "day")
      .toDate();
    handleSetDate(newDate);
  };

  const decrementDate = (e: React.MouseEvent<SVGAElement>) => {
    e.stopPropagation();
    const newDate = dayjs(date || new Date())
      .subtract(1, "day")
      .toDate();
    handleSetDate(newDate);
  };

  return (
    <nav className="relative z-30 h-16 min-h-16 w-full px-5 text-gray-500 shadow-md">
      <div className="flex h-full flex-1 items-center justify-between">
        <div className="flex items-center justify-center gap-7">
          <img src={Logo} alt="logo" className="w-36" />
          {location.pathname.includes("/bookings") && (
            <CustomDatePicker
              date={date || new Date()}
              setDate={handleSetDate}
              toggleButton={
                <div className="flex items-center justify-center gap-5">
                  <FaChevronLeft
                    className="cursor-pointer"
                    onClick={decrementDate}
                  />
                  <span>{dayjs(date || new Date()).format("DD MMM YYYY")}</span>
                  <FaChevronRight
                    className="cursor-pointer"
                    onClick={incrementDate}
                  />
                </div>
              }
            />
          )}
        </div>
        <div className="flex items-center justify-center gap-7">
          <div className="group flex items-center justify-center gap-2 rounded-full py-2 transition-all duration-150 ease-linear hover:bg-gray-100 hover:px-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="hidden flex-1 bg-transparent group-hover:flex"
            />
            <HiMiniMagnifyingGlass className="h-7 w-7" />
          </div>
          <BsGear className="h-7 w-7" />
          <GoBell className="h-7 w-7" />
          <div className="relative">
            <MdOutlineMessage className="h-7 w-7" />
            <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full border border-white bg-secondary p-0.5 text-[10px] text-white">
              00
            </span>
          </div>
          <div className="relative" ref={userRef}>
            <img
              alt="user-dp"
              className="size-10 cursor-pointer rounded-full"
              src={user?.avatar || "https://ui.shadcn.com/avatars/04.png"}
              onClick={() => setIsLogout(!isLogout)}
            />
            {isLogout && (
              <div
                onClick={handleLogout}
                className="absolute -left-10 mt-1 cursor-pointer rounded-md bg-white px-4 py-2 font-medium shadow-[rgba(0,0,0,0.24)_0px_3px_8px] hover:bg-gray-100"
              >
                Logout
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
