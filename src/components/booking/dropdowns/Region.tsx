import { LuChevronsUpDown } from "react-icons/lu";
import { ReactNode, useRef, useState } from "react";

import { cn } from "../../../utils/helpers";
import { emiratesAreas } from "../../../utils/constants";
import { useOnClickOutside } from "../../../hooks/useOnClickOutside";
import SmallArrow from "../../../assets/icons/small-colored-arrow.svg";

interface ComboboxProps {
  icon?: ReactNode;
  listClassName?: string;
  mainClassName?: string;
  toggleClassName?: string;
  defaultIconClassName?: string;
}

const RegionDropdown = ({
  icon,
  listClassName,
  mainClassName,
  toggleClassName,
  defaultIconClassName,
}: ComboboxProps) => {
  const [idToggle, setIdToggle] = useState(1);
  const [toggle, setToggle] = useState(false);
  const [area, setArea] = useState<string>("");
  const ComboboxRef = useRef<HTMLDivElement>(null);
  const [emirate, setEmirate] = useState<string>("");
  useOnClickOutside(ComboboxRef, () => setToggle(false));

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
        <span>Region</span>
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
        {emiratesAreas.map((emirate) => (
          <div
            key={emirate.id}
            className="flex w-full flex-col items-center justify-center"
          >
            <div
              onClick={() => setIdToggle(emirate.id)}
              className="flex w-full cursor-pointer items-center justify-center gap-2.5 bg-gray-100 p-2.5"
            >
              <img
                src={SmallArrow}
                alt="small-arrow"
                className={cn("size-3 -rotate-90", {
                  "rotate-0": idToggle === emirate.id,
                })}
              />
              <span className="flex-1 text-left text-sm font-bold text-primary">
                {emirate.name}
              </span>
            </div>
            {idToggle === emirate.id && (
              <div className="flex w-full flex-col items-center justify-center">
                {emirate.list.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => {
                      setArea(`${a.id}`);
                      setEmirate(`${emirate.id}`);
                      setToggle(false);
                    }}
                    className="flex w-full cursor-pointer items-center justify-start gap-2.5 p-2.5 hover:bg-primary/20"
                  >
                    <div className="size-4 rounded-sm border border-gray-400 p-px">
                      <div
                        className={cn("size-full rounded-sm", {
                          "bg-gray-400": a.id === parseInt(area),
                        })}
                      />
                    </div>
                    <span className="flex-1 overflow-hidden truncate text-left text-xs">
                      {a.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegionDropdown;
