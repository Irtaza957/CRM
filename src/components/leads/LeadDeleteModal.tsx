import Modal from "../ui/Modal";
import CustomButton from "../ui/CustomButton";
import Iconbin from "../../assets/icons/icon-bin.svg";

interface LeadDeleteModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loadingButton?: boolean;
  handleConfirm: () => void;
}

const LeadDeleteModal = ({
  open,
  setOpen,
  loadingButton,
  handleConfirm
}: LeadDeleteModalProps) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Modal open={open} setOpen={setOpen} className="w-[35%] flex justify-center items-center">
      <div className="flex h-auto flex-col items-center justify-center overflow-hidden rounded-lg bg-white">
        <div className="flex flex-col items-center gap-6 text-center px-16 py-10">
          <div>
            <img src={Iconbin} alt="" className="w-20 h-20" />
          </div>
          <div>
            <p>
              Are you sure want to <br />
              delete this Lead?
            </p>
          </div>
          <div className="flex gap-3">
            <CustomButton
              name="Cancel"
              handleClick={handleClose}
              style="bg-[#F5F6FA] text-[#656565] px-10 border border-grey50"
            />
            <CustomButton
              name="Delete"
              loading={loadingButton}
              handleClick={handleConfirm}
              style="bg-danger px-10"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LeadDeleteModal;
