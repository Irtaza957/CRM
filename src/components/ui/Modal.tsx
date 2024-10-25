import { IoClose } from "react-icons/io5";
import { cn } from "../../utils/helpers";
import { ReactNode, type Dispatch, type SetStateAction } from "react";

interface ModalProps {
  open: boolean;
  className?: string;
  children: ReactNode;
  mainClassName?: string;
  title?: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const Modal = ({ open, children, mainClassName, className, setOpen, title }: ModalProps) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black/30 backdrop-blur-sm",
        mainClassName,
        {
          hidden: !open,
        }
      )}
    >
      <div className={cn("flex rounded-lg bg-white", className)}>
        {title ?
        <div className="flex w-full flex-col items-center justify-center rounded-lg bg-gray-100">
          <div className="flex w-full items-center justify-between rounded-t-lg bg-primary px-5 py-2.5 text-white">
            <h1 className="text-xl font-medium">{title}</h1>
            <IoClose
              onClick={() => setOpen(false)}
              className="h-8 w-8 cursor-pointer"
            />
          </div>
          <div className="flex w-full flex-col items-center justify-center space-y-2.5 rounded-b-lg bg-white p-2.5">
            {children}
          </div>
        </div> :
        children}
      </div>
    </div>
  );
};

export default Modal;
