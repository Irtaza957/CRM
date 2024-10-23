import { RootState } from "../../store";
import { cn } from "../../utils/helpers";
import { setDate } from "../../store/slices/global";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const CustomDatePicker = ({
  toggleButton,
}: {
  toggleButton: React.ReactNode;
}) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentDate = new Date();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const dateRef = useRef(null);
  const dispatch = useDispatch();
  const [toggle, setToggle] = useState(false);
  useOnClickOutside(dateRef, () => setToggle(false));
  const { date } = useSelector((state: RootState) => state.global);
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const daysInMonths = new Date(currentYear, currentMonth + 1, 0).getDate();
  const initialDateOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
    setCurrentYear((prevYear) =>
      currentMonth === 0 ? prevYear - 1 : prevYear
    );
  };

  const nextMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
    setCurrentYear((prevYear) =>
      currentMonth === 11 ? prevYear + 1 : prevYear
    );
  };

  const changeDate = (date: string) => {
    dispatch(setDate(date));
  };

  useEffect(() => {
    if (date) {
      setCurrentMonth(new Date(date).getMonth());
      setCurrentYear(new Date(date).getFullYear());
    }
  }, [date]);

  return (
    <div
      ref={dateRef}
      className="relative col-span-1 flex w-full flex-col items-start justify-start"
    >
      <div className="w-full cursor-pointer" onClick={() => setToggle(!toggle)}>
        {toggleButton}
      </div>
      {toggle && (
        <div className="absolute right-0 top-[50px] z-20 flex flex-col items-center justify-center gap-2.5 rounded-lg border bg-white p-2.5">
          <div className="flex w-full items-center justify-between gap-5">
            <select
              value={months[currentMonth]}
              onChange={(e) =>
                setCurrentMonth(months.findIndex((m) => m === e.target.value))
              }
              className="text-xs"
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <select
              value={currentYear}
              onChange={(e) => setCurrentYear(parseInt(e.target.value))}
              className="text-xs"
            >
              {Array.from(
                { length: currentDate.getFullYear() - 1980 + 1 },
                (_, index) => 1980 + index
              ).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <div className="col-span-1 flex w-full items-center justify-end gap-1.5">
              <button
                type="button"
                onClick={prevMonth}
                className="size-5 rounded-full border p-[2px]"
              >
                <FaChevronLeft className="size-full" />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="size-5 rounded-full border p-[2px]"
              >
                <FaChevronRight className="size-full" />
              </button>
            </div>
          </div>
          <div className="grid w-full grid-cols-7">
            {daysOfWeek.map((day) => (
              <span
                key={day}
                className="w-full text-center text-xs font-medium"
              >
                {day}
              </span>
            ))}
          </div>
          <div className="grid w-full grid-cols-7">
            {[...Array(initialDateOfMonth).keys()].map((_, idx) => (
              <span
                key={idx}
                className="w-full text-center text-xs font-medium"
              />
            ))}
            {[...Array(daysInMonths).keys()].map((day) => (
              <span
                key={day}
                onClick={() =>
                  changeDate(`${currentYear}-${currentMonth + 1}-${day + 1}`)
                }
                className={cn(
                  "flex h-8 w-full cursor-pointer items-center justify-center rounded-full text-center text-xs font-medium hover:bg-primary/20",
                  {
                    "bg-primary font-medium text-white hover:bg-primary/70":
                      date
                        ? day + 1 === new Date(date).getDate() &&
                          currentMonth === new Date(date).getMonth() &&
                          currentYear === new Date(date).getFullYear()
                        : day + 1 === currentDate.getDate() &&
                          currentMonth === currentDate.getMonth() &&
                          currentYear === currentDate.getFullYear(),
                  }
                )}
              >
                {day + 1}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
