import Modal from "../ui/Modal";
import CustomButton from "../ui/CustomButton";

interface LeadDeleteModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loadingButton?: boolean;
  theme?: "success" | "danger";
  confirmBtnText?: string;
  handleConfirm: () => void;
    text?: string;
}

const ConfirmationModal = ({
  open,
  setOpen,
  loadingButton,
  handleConfirm,
  text,
  theme,
  confirmBtnText,
}: LeadDeleteModalProps) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Modal open={open} setOpen={setOpen} className="w-[35%] flex justify-center items-center">
      <div className="flex h-auto flex-col items-center justify-center overflow-hidden rounded-lg bg-white">
        <div className="flex flex-col items-center gap-6 text-center px-16 py-10">
          <div>
            <p>
              {text}
            </p>
          </div>
          <div className="flex gap-3">
            <CustomButton
              name="Cancel"
              handleClick={handleClose}
              style="bg-[#F5F6FA] text-[#656565] px-10 border border-grey50"
            />
            <CustomButton
              name={confirmBtnText}
              loading={loadingButton}
              handleClick={handleConfirm}
              style={theme === "success" ? "bg-green-500 px-10" : "bg-danger px-10"}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;