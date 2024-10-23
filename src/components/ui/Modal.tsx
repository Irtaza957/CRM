import { cn } from "../../utils/helpers";
import { ReactNode, type Dispatch, type SetStateAction } from "react";

interface ModalProps {
  open: boolean;
  className?: string;
  children: ReactNode;
  mainClassName?: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const Modal = ({ open, children, mainClassName, className }: ModalProps) => {
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
        {children}
      </div>
    </div>
  );
};

export default Modal;
