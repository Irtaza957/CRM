import { LuChevronsUpDown } from "react-icons/lu";
import { ReactNode, useRef, useState } from "react";

import { cn } from "../../../utils/helpers";
import { sources } from "../../../utils/constants";
import { useOnClickOutside } from "../../../hooks/useOnClickOutside";
import SmallArrow from "../../../assets/icons/small-colored-arrow.svg";

interface ComboboxProps {
  icon?: ReactNode;
  listClassName?: string;
  mainClassName?: string;
  toggleClassName?: string;
  defaultIconClassName?: string;
}

const SourceDropdown = ({
  icon,
  listClassName,
  mainClassName,
  toggleClassName,
  defaultIconClassName,
}: ComboboxProps) => {
  const [idToggle, setIdToggle] = useState(1);
  const [toggle, setToggle] = useState(false);
  const ComboboxRef = useRef<HTMLDivElement>(null);
  const [source, setSource] = useState<string>("");
  const [channel, setChannel] = useState<string>("");
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
        <span>Source</span>
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
        {sources.map((source) => (
          <div
            key={source.id}
            className="flex w-full flex-col items-center justify-center"
          >
            <div
              onClick={() => setIdToggle(source.id)}
              className="flex w-full cursor-pointer items-center justify-center gap-2.5 bg-gray-100 p-2.5"
            >
              <img
                src={SmallArrow}
                alt="small-arrow"
                className={cn("size-3 -rotate-90", {
                  "rotate-0": idToggle === source.id,
                })}
              />
              <span className="flex-1 text-left text-sm font-bold text-primary">
                {source.name}
              </span>
            </div>
            {idToggle === source.id && (
              <div className="flex w-full flex-col items-center justify-center">
                {source.list.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => {
                      setChannel(`${a.id}`);
                      setSource(`${source.id}`);
                      setToggle(false);
                    }}
                    className="flex w-full cursor-pointer items-center justify-start gap-2.5 p-2.5 hover:bg-primary/20"
                  >
                    <div className="size-4 rounded-sm border border-gray-400 p-px">
                      <div
                        className={cn("size-full rounded-sm", {
                          "bg-gray-400": a.id === parseInt(channel),
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

export default SourceDropdown;
