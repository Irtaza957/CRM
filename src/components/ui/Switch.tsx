import { useState } from "react";
import { cn } from "../../utils/helpers";

interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({ checked = false, onChange }) => {
  const [toggle, setToggle] = useState(checked);

  const handleToggle = () => {
    const newValue = !toggle;
    setToggle(newValue);
    onChange?.(newValue); // Call the onChange prop if provided
  };

  return (
    <div
      onClick={handleToggle}
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
