import { FaCheck } from "react-icons/fa";
import { LuChevronsUpDown } from "react-icons/lu";
import { ReactNode, useRef, useState } from "react";

import { cn } from "../../utils/helpers";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

interface ComboboxProps {
  icon?: ReactNode;
  placeholder: string;
  listClassName?: string;
  mainClassName?: string;
  selectedIcon?: ReactNode;
  toggleClassName?: string;
  listItemClassName?: string;
  options?: ListOptionProps[];
  value: ListOptionProps | null | [];
  defaultIconClassName?: string;
  searchInputClassName?: string;
  searchInputPlaceholder?: string;
  defaultSelectedIconClassName?: string;
  label?: string;
  isSearch?: boolean;
  isFilter?: boolean;
  disabled?: boolean;
  isMultiSelect?: boolean;
  setValue?: React.Dispatch<React.SetStateAction<ListOptionProps | null>>;
  handleSelect?: (arg0: ListOptionProps) => void;
  errorMsg?: string | FieldError | Merge<FieldError, FieldErrorsImpl>;
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
  isSearch = true,
  // isFilter,
  disabled,
  isMultiSelect = false,
  handleSelect,
  errorMsg,
}: ComboboxProps) => {
  const [toggle, setToggle] = useState(false);
  const [query, setQuery] = useState<string>("");
  const ComboboxRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(ComboboxRef, () => setToggle(false));

  // const handleToggle = (dropdownValue: ListOptionProps) => {
  //   if (isFilter && value?.id === dropdownValue?.id) {
  //     handleSelect && handleSelect({ id: 0, name: "" });
  //   } else {
  //     handleSelect && handleSelect(dropdownValue);
  //   }
  // };

  const handleClick = (item: ListOptionProps) => {
    if (isMultiSelect) {
      let selected: ListOptionProps[] | null = value as ListOptionProps[];
      if (selected?.find((selectedItem) => selectedItem.id === item.id)) {
        selected = selected.filter((selectedItem) => selectedItem.id !== item.id);
      } else {
        selected = [...(selected || []), {id: item.id, name: item.name}];
      }
      setValue?.(selected as any);
      handleSelect?.(selected as any);
    } else {
      setValue?.(item);
      handleSelect?.(item);
      setToggle(false);
    }
  }

  const isSelected = (item: ListOptionProps) => {
    if (isMultiSelect) {
      return (value as ListOptionProps[])?.some(
        (selectedItem) => selectedItem.id === item.id
      );
    }
    return (value as ListOptionProps)?.id === item.id;
  };

  return (
    <div
      ref={ComboboxRef}
      className={cn(
        "relative flex flex-col items-start justify-start",
        mainClassName
      )}
    >
      {label && (
        <label className="mb-0.5 w-full text-left text-xs font-medium text-grey100">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setToggle(!toggle)}
        className={cn(
          `flex items-center justify-between space-x-3 ${disabled && "opacity-50"}`,
          toggleClassName
        )}
        disabled={disabled}
      >
         <span className={`${isMultiSelect ? "flex flex-wrap gap-1" : "truncate"}`}>
          {isMultiSelect && (value as ListOptionProps[])?.length
            ? (value as ListOptionProps[])?.map((item: ListOptionProps) => item.name).join(", ") ||
              placeholder
            : (value as ListOptionProps)?.name || placeholder}
        </span>
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
        {isSearch && (
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
        )}
        {query ? (
          options?.filter((item) =>
            item.name.toLowerCase().includes(query.toLowerCase())
          ).length === 0 ? (
            <p className="w-full py-1.5 text-center text-xs font-semibold">
              No Results
            </p>
          ) : (
            options
              ?.filter((item) =>
                item.name.toLowerCase().includes(query.toLowerCase())
              )
              .map((item) => (
                <p
                  key={item.id}
                  onClick={() => handleClick(item)}
                  className={cn(
                    "flex cursor-pointer items-center justify-start",
                    listItemClassName
                  )}
                >
                  <span>{item.name}</span>
                  {isSelected(item) ? (
                    selectedIcon ? (
                      selectedIcon
                    ) : (
                      <FaCheck className={cn(defaultSelectedIconClassName)} />
                    )
                  ) : null}
                </p>
              ))
          )
        ) : options?.length ? (
          options?.map((item) => (
            <p
              key={item.id}
              onClick={() => handleClick(item)}
              className={cn(
                "flex cursor-pointer items-center justify-start",
                listItemClassName
              )}
            >
              <span>{item.name}</span>
              {isSelected(item) ? (
                selectedIcon ? (
                  selectedIcon
                ) : (
                  <FaCheck className={cn(defaultSelectedIconClassName)} />
                )
              ) : null}
            </p>
          ))
        ) : (
          <p className="w-full py-1.5 text-center text-xs font-semibold">
            No Results
          </p>
        )}
      </div>
      {errorMsg && (
        <p className="mt-1 text-xs text-red-500">*{errorMsg as string}</p>
      )}
    </div>
  );
};

export default Combobox;
