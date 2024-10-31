import { RootState } from "../store";
import Logo from "../assets/img/logo.svg";
import CustomDatePicker from "./ui/CustomDatePicker";

import { useState } from "react";
import { GoBell } from "react-icons/go";
import { BsGear } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineMessage } from "react-icons/md";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { setDate } from "../store/slices/global";
import dayjs from "dayjs";

const Navbar = () => {
  const [search, setSearch] = useState("");

  const { user, date } = useSelector((state: RootState) => state.global);
  const dispatch = useDispatch();

  const handleSetDate = (date: string | Date) => {
    dispatch(setDate(date));
  };

  return (
    <nav className="relative z-30 h-16 min-h-16 w-full px-5 text-gray-500 shadow-md">
      <div className="flex h-full flex-1 items-center justify-between">
        <div className="flex items-center justify-center gap-7">
          <img src={Logo} alt="logo" className="w-36" />
          <CustomDatePicker
            date={date}
            setDate={handleSetDate}
            toggleButton={
              <div className="flex items-center justify-center gap-5">
                <FaChevronLeft />
                <span>
                  {dayjs(date || new Date()).format("DD MMM YYYY")}
                </span>
                <FaChevronRight />
              </div>
            }
          />
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
          <img
            alt="user-dp"
            className="size-10 rounded-full"
            src={user?.avatar || "https://ui.shadcn.com/avatars/04.png"}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
