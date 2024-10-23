import { LuChevronsUpDown } from "react-icons/lu";
import { ReactNode, useRef, useState } from "react";

import { cn } from "../../../utils/helpers";
import { professionals } from "../../../utils/constants";
import { useOnClickOutside } from "../../../hooks/useOnClickOutside";
import SmallArrow from "../../../assets/icons/small-colored-arrow.svg";

interface ComboboxProps {
  icon?: ReactNode;
  listClassName?: string;
  mainClassName?: string;
  toggleClassName?: string;
  defaultIconClassName?: string;
}

const ProfessionalDropdown = ({
  icon,
  listClassName,
  mainClassName,
  toggleClassName,
  defaultIconClassName,
}: ComboboxProps) => {
  const [toggle, setToggle] = useState(false);
  const [idToggle, setIdToggle] = useState(1);
  const ComboboxRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(ComboboxRef, () => setToggle(false));
  const [employee, setEmployee] = useState<ListOptionProps | null>(null);

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
        <span>Professional</span>
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
        {professionals.map((profession) => (
          <div
            key={profession.id}
            className="flex w-full flex-col items-center justify-center"
          >
            <div
              onClick={() => setIdToggle(profession.id)}
              className="flex w-full cursor-pointer items-center justify-center gap-2.5 bg-gray-100 p-2.5"
            >
              <img
                src={SmallArrow}
                alt="small-arrow"
                className={cn("size-3 -rotate-90", {
                  "rotate-0": idToggle === profession.id,
                })}
              />
              <span className="flex-1 text-left text-sm font-bold text-primary">
                {profession.name}
              </span>
            </div>
            {idToggle === profession.id && (
              <div className="flex w-full flex-col items-center justify-center">
                {profession.list.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => {
                      setEmployee(a);
                      setToggle(false);
                    }}
                    className="flex w-full cursor-pointer items-center justify-start gap-2.5 p-2.5 hover:bg-primary/20"
                  >
                    <div className="size-4 rounded-sm border border-gray-400 p-px">
                      <div
                        className={cn("size-full rounded-sm", {
                          "bg-gray-400": a.id === employee?.id,
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

export default ProfessionalDropdown;
