import { LuChevronsUpDown } from "react-icons/lu";
import { ReactNode, useEffect, useRef, useState } from "react";

import { cn } from "../../../utils/helpers";
import { useOnClickOutside } from "../../../hooks/useOnClickOutside";
import { FaCheck } from "react-icons/fa";
interface ComboboxProps {
  icon?: ReactNode;
  placeholder: string;
  listClassName?: string;
  mainClassName?: string;
  toggleClassName?: string;
  listItemClassName?: string;
  value: ListOptionProps | null;
  defaultIconClassName?: string;
  searchInputClassName?: string;
  searchInputPlaceholder: string;
  data?: CategoryAllListProps[];
  setValue?: React.Dispatch<React.SetStateAction<ListOptionProps | null>>;
  handleSelectCategoryFilter?: (value: ListOptionProps) => void;
}

const CategoryDropdown = ({
  icon,
  value,
  setValue,
  placeholder,
  listClassName,
  mainClassName,
  toggleClassName,
  listItemClassName,
  defaultIconClassName,
  searchInputClassName,
  searchInputPlaceholder,
  data,
  handleSelectCategoryFilter,
}: ComboboxProps) => {
  const [toggle, setToggle] = useState(false);
  const [query, setQuery] = useState<string>("");
  const ComboboxRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(ComboboxRef, () => setToggle(false));
  const [options, setOptions] = useState<ListOptionProps[]>([]);

  useEffect(() => {
    if (data) {
      const formatted = data.map((item) => {
        return {
          id: parseInt(item.category_id),
          name: item.category_name,
          color: item.color,
        };
      });

      setOptions(formatted);
    }
  }, [data]);

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
          "flex items-center justify-between space-x-3",
          toggleClassName
        )}
      >
        <span className="truncate">{value ? value.name : placeholder}</span>
        {icon ? (
          icon
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
          options.filter((item) =>
            item.name.toLowerCase().includes(query.toLowerCase())
          ).length === 0 ? (
            <p className="w-full py-1.5 text-center text-xs font-semibold">
              No Results
            </p>
          ) : (
            options
              .filter((item) =>
                item.name.toLowerCase().includes(query.toLowerCase())
              )
              .map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    handleSelectCategoryFilter ? handleSelectCategoryFilter(item) : setValue && setValue(item);
                    setToggle(false);
                  }}
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-center gap-2 p-2.5 hover:bg-gray-100",
                    listItemClassName
                  )}
                >
                  {/* <div className="size-4 rounded-sm border border-gray-400 p-px">
                    <div
                      className={cn("size-full rounded-sm", {
                        "bg-gray-400": value?.id === item.id,
                      })}
                    />
                  </div> */}
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
          options.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                handleSelectCategoryFilter ? handleSelectCategoryFilter(item) : setValue && setValue(item);
                setToggle(false);
              }}
              className={cn(
                "flex w-full cursor-pointer items-center justify-center gap-2 p-2.5 hover:bg-gray-100",
                listItemClassName
              )}
            >
              {/* <div className="size-4 rounded-sm border border-gray-400 p-px">
                <div
                  className={cn("size-full rounded-sm", {
                    "bg-gray-400": value?.id === item.id,
                  })}
                />
              </div> */}
              <span className="flex-1 overflow-hidden truncate text-left text-xs">
                {item.name}
              </span>
                {value?.id===item.id && <FaCheck className="size-4" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryDropdown;
