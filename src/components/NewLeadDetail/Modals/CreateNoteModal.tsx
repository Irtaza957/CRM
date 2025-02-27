import { IoClose } from "react-icons/io5";
import Modal from "../../ui/Modal";
import CustomButton from "../../ui/CustomButton";

const CreateNoteModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Modal open={open} setOpen={setOpen} className="w-[95%] lg:w-[50%]">
      <div className="flex h-auto w-full flex-col overflow-hidden rounded-lg bg-white">
        <div className="flex w-full items-center justify-between bg-primary px-5 py-4 text-white">
          <h1 className="text-xl font-medium">Add Note</h1>
          <div className="flex items-center justify-center gap-2">
            <IoClose onClick={handleClose} className="h-8 w-8 cursor-pointer" />
          </div>
        </div>
        <div className="flex flex-col gap-5 px-6 py-6 text-[#656565]">
          <div className="flex flex-col gap-2">
            <span>Note</span>
            <textarea
              placeholder=""
              rows={5}
              className="w-full resize-none rounded-lg bg-[#F2F2F2] px-3.5 py-2.5"
            />
          </div>
          <div className="pt-md-4 flex items-center justify-end">
            <div className="flex items-center gap-2">
              <CustomButton
                name="Cancel"
                handleClick={handleClose}
                style="bg-[#FF1D1C] py-3 rounded-lg text-white w-[150px]"
              />
              <CustomButton
                name="Save"
                handleClick={handleClose}
                style="bg-primary text-white py-3 rounded-lg w-[150px]"
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateNoteModal;
