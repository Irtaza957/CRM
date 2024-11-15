import { LuChevronsUpDown } from "react-icons/lu";
import { Dispatch, ReactNode, SetStateAction, useRef, useState } from "react";

import { cn } from "../../../utils/helpers";
import { providers } from "../../../utils/constants";
import { useOnClickOutside } from "../../../hooks/useOnClickOutside";
import SmallArrow from "../../../assets/icons/small-colored-arrow.svg";

interface ComboboxProps {
  provider: string;
  icon?: ReactNode;
  listClassName?: string;
  mainClassName?: string;
  toggleClassName?: string;
  defaultIconClassName?: string;
  setProvider: Dispatch<SetStateAction<string>>;
}

const ProviderDropdown = ({
  icon,
  setProvider,
  listClassName,
  mainClassName,
  toggleClassName,
  defaultIconClassName,
}: ComboboxProps) => {
  const [idToggle, setIdToggle] = useState(1);
  const [toggle, setToggle] = useState(false);
  const [branch, setBranch] = useState<string>("");
  const ComboboxRef = useRef<HTMLDivElement>(null);
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
        <span>Company</span>
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
        {providers.map((provider) => (
          <div
            key={provider.id}
            className="flex w-full flex-col items-center justify-center"
          >
            <div
              onClick={() => setIdToggle(provider.id)}
              className="flex w-full cursor-pointer items-center justify-center gap-2.5 bg-gray-100 p-2.5"
            >
              <img
                src={SmallArrow}
                alt="small-arrow"
                className={cn("size-3 -rotate-90", {
                  "rotate-0": idToggle === provider.id,
                })}
              />
              <span className="flex-1 text-left text-sm font-bold text-primary">
                {provider.name}
              </span>
            </div>
            {idToggle === provider.id && (
              <div className="flex w-full flex-col items-center justify-center">
                {provider.list.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => {
                      setBranch(`${a.id}`);
                      setProvider(`${provider.id}`);
                      setToggle(false);
                    }}
                    className="flex w-full cursor-pointer items-center justify-start gap-2.5 p-2.5 hover:bg-primary/20"
                  >
                    <div className="size-4 rounded-sm border border-gray-400 p-px">
                      <div
                        className={cn("size-full rounded-sm", {
                          "bg-gray-400": a.id === parseInt(branch),
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

export default ProviderDropdown;
