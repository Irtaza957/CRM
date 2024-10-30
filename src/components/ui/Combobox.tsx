import { FaCheck } from "react-icons/fa";
import { LuChevronsUpDown } from "react-icons/lu";
import { ReactNode, useRef, useState } from "react";

import { cn } from "../../utils/helpers";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

interface ComboboxProps {
  icon?: ReactNode;
  placeholder: string;
  listClassName?: string;
  mainClassName?: string;
  selectedIcon?: ReactNode;
  toggleClassName?: string;
  listItemClassName?: string;
  options: ListOptionProps[];
  value: ListOptionProps | null;
  defaultIconClassName?: string;
  searchInputClassName?: string;
  searchInputPlaceholder?: string;
  defaultSelectedIconClassName?: string;
  label?: string;
  isSearch?: boolean;
  isFilter?: boolean;
  setValue?: React.Dispatch<React.SetStateAction<ListOptionProps | null>>;
  handleSelect?: (arg0: ListOptionProps)=>void
}

const Combobox = ({
  icon,
  value,
  options,
  setValue,
  placeholder,
  selectedIcon,
  listClassName,
  mainClassName,
  toggleClassName,
  listItemClassName,
  defaultIconClassName,
  searchInputClassName,
  searchInputPlaceholder,
  defaultSelectedIconClassName,
  label,
  isSearch=true,
  isFilter,
  handleSelect
}: ComboboxProps) => {
  const [toggle, setToggle] = useState(false);
  const [query, setQuery] = useState<string>("");
  const ComboboxRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(ComboboxRef, () => setToggle(false));

  const handleToggle=(dropdownValue: ListOptionProps)=>{
    if(!isFilter){
      setToggle(!toggle)
    }
    if(isFilter && value?.id===dropdownValue?.id){
      handleSelect && handleSelect({id: 0, name: ''})
    }else{
      handleSelect && handleSelect(dropdownValue)
    }
  }

  return (
    <div
      ref={ComboboxRef}
      className={cn(
        "relative flex flex-col items-start justify-start",
        mainClassName
      )}
    >
      {label && <label className="w-full text-left text-xs text-grey100 font-medium mb-0.5">
        {label}
      </label>}
      <button
        type="button"
        onClick={() => setToggle(!toggle)}
        className={cn(
          "flex items-center justify-between space-x-3",
          toggleClassName
        )}
      >
        <span>{value?.name ? value.name : placeholder}</span>
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
        {isSearch &&
        <input
          type="text"
          value={query}
          placeholder={searchInputPlaceholder}
          onChange={(e) => setQuery(e.target.value)}
          className={cn(
            "sticky left-0 top-0 w-full border-b",
            searchInputClassName
          )}
        />}
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
                <p
                  key={item.id}
                  onClick={handleSelect ? ()=>handleToggle(item) : () => setValue?.(item)}
                  className={cn(
                    "flex cursor-pointer items-center justify-start",
                    listItemClassName
                  )}
                >
                  <span>{item.name}</span>
                  {value?.id === item.id ? (
                    selectedIcon ? (
                      selectedIcon
                    ) : (
                      <FaCheck className={cn(defaultSelectedIconClassName)} />
                    )
                  ) : null}
                </p>
              ))
          )
        ) : (
          options.map((item) => (
            <p
              key={item.id}
              onClick={handleSelect ? ()=>handleToggle(item) : () => setValue?.(item)}
              className={cn(
                "flex cursor-pointer items-center justify-start",
                listItemClassName
              )}
            >
              <span>{item.name}</span>
              {value?.id === item.id ? (
                selectedIcon ? (
                  selectedIcon
                ) : (
                  <FaCheck className={cn(defaultSelectedIconClassName)} />
                )
              ) : null}
            </p>
          ))
        )}
      </div>
    </div>
  );
};

export default Combobox;
