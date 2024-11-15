import { LuChevronsUpDown } from "react-icons/lu";
import { ReactNode, useRef, useState } from "react";

import { cn } from "../../../utils/helpers";
import { bookingStatuses } from "../../../utils/constants";
import { useOnClickOutside } from "../../../hooks/useOnClickOutside";

interface ComboboxProps {
  icon?: ReactNode;
  listClassName?: string;
  mainClassName?: string;
  toggleClassName?: string;
  listItemClassName?: string;
  defaultIconClassName?: string;
  searchInputClassName?: string;
  searchInputPlaceholder: string;
  sidebar?: boolean;
}

const BookingStatusDropdown = ({
  icon,
  listClassName,
  mainClassName,
  toggleClassName,
  listItemClassName,
  defaultIconClassName,
  searchInputClassName,
  searchInputPlaceholder,
  sidebar,
}: ComboboxProps) => {
  const [toggle, setToggle] = useState(false);
  const [query, setQuery] = useState<string>("");
  const ComboboxRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(ComboboxRef, () => setToggle(false));
  const [value, setValue] = useState<ListOptionProps | null>(null);

  return (
    <div
      ref={ComboboxRef}
      className={cn(
        "relative flex flex-col items-start justify-start",
        mainClassName
      )}
    >
      <button
        type="button"
        onClick={() => setToggle(!toggle)}
        className={cn(
          `flex items-center justify-between whitespace-nowrap ${sidebar ? "space-x-2" : "space-x-3"}`,
          toggleClassName
        )}
      >
        <span>Booking Status</span>
        {icon ? (
          <div>{icon}</div>
        ) : (
          <LuChevronsUpDown className={cn(defaultIconClassName)} />
        )}
      </button>
      <div
        className={cn(
          "no-scrollbar absolute flex flex-col items-start justify-start overflow-auto transition-all ease-linear",
          listClassName,
          {
            "h-0 opacity-0": !toggle,
            "h-fit opacity-100": toggle,
          }
        )}
      >
        <input
          type="text"
          value={query}
          placeholder={searchInputPlaceholder}
          onChange={(e) => setQuery(e.target.value)}
          className={cn(
            "sticky left-0 top-0 w-full border-b",
            searchInputClassName
          )}
        />
        {query ? (
          bookingStatuses.filter((item) =>
            item.name.toLowerCase().includes(query.toLowerCase())
          ).length === 0 ? (
            <p className="w-full py-1.5 text-center text-xs font-semibold">
              No Results
            </p>
          ) : (
            bookingStatuses
              .filter((item) =>
                item.name.toLowerCase().includes(query.toLowerCase())
              )
              .map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setValue(item);
                    setToggle(false);
                  }}
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-center gap-2 p-2.5 hover:bg-gray-100",
                    listItemClassName
                  )}
                >
                  <div className="size-4 rounded-sm border border-gray-400 p-px">
                    <div
                      className={cn("size-full rounded-sm", {
                        "bg-gray-400": value?.id === item.id,
                      })}
                    />
                  </div>
                  <span className="flex-1 overflow-hidden truncate text-left text-xs">
                    {item.name}
                  </span>
                  <div
                    style={{ backgroundColor: item.color }}
                    className="size-5 rounded-full"
                  />
                </div>
              ))
          )
        ) : (
          bookingStatuses.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setValue(item);
                setToggle(false);
              }}
              className={cn(
                "flex w-full cursor-pointer items-center justify-start gap-2 p-2.5 hover:bg-gray-100",
                listItemClassName
              )}
            >
              <div className="size-4 rounded-sm border border-gray-400 p-px">
                <div
                  className={cn("size-full rounded-sm", {
                    "bg-gray-400": value?.id === item.id,
                  })}
                />
              </div>
              <span
                style={{ backgroundColor: item.color }}
                className="rounded-full px-2 py-0.5 text-xs font-semibold text-white"
              >
                {item.name}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookingStatusDropdown;
