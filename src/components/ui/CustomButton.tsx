import { LuLoader2 } from "react-icons/lu";
import { cn } from "../../utils/helpers";

interface CustomButton {
  name: string;
  style?: string;
  loading?: boolean;
  disabled?: boolean;
  handleClick: (e?: React.MouseEvent<HTMLButtonElement>) => void;
}
const CustomButton = ({
  name,
  style,
  loading,
  disabled,
  handleClick,
}: CustomButton) => {
  return (
    <button
      onClick={handleClick}
      className={cn(
        `rounded-md bg-primary px-6 py-2 text-xs text-white ${disabled && "cursor-not-allowed opacity-50"}`,
        style
      )}
      disabled={disabled}
    >
      {loading ? (
        <div className="flex w-full items-center justify-center gap-3">
          <LuLoader2 className="animate-spin" />
          <span>Please Wait...</span>
        </div>
      ) : (
        name
      )}
    </button>
  );
};

export default CustomButton;
