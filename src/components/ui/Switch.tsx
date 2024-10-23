import { useState } from "react";
import { cn } from "../../utils/helpers";

const Switch = () => {
  const [toggle, setToggle] = useState(false);

  return (
    <div
      onClick={() => setToggle(!toggle)}
      className={cn("w-[48px] rounded-full bg-red-500 p-[2px]", {
        "bg-secondary": toggle,
      })}
    >
      <div
        className={cn(
          "size-[20px] cursor-pointer rounded-full bg-white transition-all duration-150 ease-linear",
          {
            "translate-x-[24px]": toggle,
            "translate-x-0": !toggle,
          }
        )}
      />
    </div>
  );
};

export default Switch;
