import { cn } from "../../utils/helpers";

import { toast } from "sonner";
import { MdError } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";

const CustomToast = ({
  t,
  type,
  title,
  message,
}: {
  t: any;
  type: string;
  title: string;
  message: string;
}) => {
  return (
    <div
      onClick={() => toast.dismiss(t)}
      className={cn(
        "flex w-[355px] items-center justify-start space-x-3 rounded-lg p-3 text-white",
        {
          "bg-red-500": type === "error",
          "bg-secondary": type === "success",
        }
      )}
    >
      {type === "error" ? (
        <MdError className="h-6 w-6" />
      ) : (
        <FaCheckCircle className="h-6 w-6" />
      )}
      <div className="flex flex-col items-center justify-center">
        <p className="w-full text-left text-sm font-semibold capitalize">
          {title}
        </p>
        <p className="w-full text-left text-xs">{message}</p>
      </div>
    </div>
  );
};

export default CustomToast;
