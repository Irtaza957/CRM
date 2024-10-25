import Modal from "../../ui/Modal";
import CustomToast from "../../ui/CustomToast";
import GrayX from "../../../assets/icons/gray-x.svg";
import Upload from "../../../assets/icons/upload.svg";
import Download from "../../../assets/icons/download.svg";
import PlainDoc from "../../../assets/icons/plain-doc.svg";
import ChevronDown from "../../../assets/icons/chevron-down.svg";
import { useOnClickOutside } from "../../../hooks/useOnClickOutside";

import { toast } from "sonner";
import { useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import Dropzone, { FileRejection } from "react-dropzone";

interface Attachment {
  id: number;
  name: string;
  file: File;
}

const fileTypes = [
  {
    id: 1,
    name: "Customer Attachment",
  },
  {
    id: 2,
    name: "Booking Attachment",
  },
];

const UploadDocumentsModal = ({ open, setOpen }: ModalProps) => {
  const showRef = useRef(null);
  const [show, setShow] = useState(false);
  useOnClickOutside(showRef, () => {
    setToggledID(null);
    setShow(false);
  });
  const [files, setFiles] = useState<Attachment[]>([]);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [toggledID, setToggledID] = useState<number | null>(null);

  const onDropRejected = (rejectedFiles: FileRejection[]) => {
    const [file] = rejectedFiles;
    setIsDragOver(false);
    if (file.file.size <= 1 * 1024 * 1024) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          type="error"
          title={`${file.file.type} is not supported.`}
          message="Please Choose a PNG, JPG or JPEG file instead."
        />
      ));
    } else {
      toast.custom((t) => (
        <CustomToast
          t={t}
          type="error"
          title={`${file.file.name} Image Size Exceeds 1MB`}
          message="Please Choose an Image <= 1MB instead."
        />
      ));
    }
  };

  const onDropAccepted = async (acceptedFiles: File[]) => {
    setIsDragOver(false);
    const final = acceptedFiles.map((file, id) => {
      return {
        id,
        file,
        name: "",
      };
    });
    setFiles([...final, ...files]);
  };

  const removeImage = (id: number) => {
    setFiles(files.filter((file) => file.id !== id));
  };

  const setFileType = (type: string, id: number) => {
    const temp = files;
    temp[id].name = type;

    setFiles([...temp]);
    setToggledID(null);
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      mainClassName="!z-[99999]"
      className="w-full max-w-lg"
    >
      <div className="flex w-full flex-col items-center justify-center rounded-lg bg-white">
        <div className="flex w-full items-center justify-between rounded-t-lg bg-primary px-5 py-2.5 text-white">
          <h1 className="text-xl font-medium">Upload Documents</h1>
          <IoClose
            onClick={() => setOpen(false)}
            className="h-8 w-8 cursor-pointer"
          />
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-5 p-5">
          <Dropzone
            maxSize={1 * 1024 * 1024}
            accept={{
              "image/png": [".png"],
              "image/jpg": [".jpg"],
              "image/jpeg": [".jpeg"],
            }}
            onDropRejected={onDropRejected}
            onDropAccepted={onDropAccepted}
            onDragEnter={() => setIsDragOver(true)}
            onDragLeave={() => setIsDragOver(false)}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                className="flex w-full flex-col items-center justify-center gap-5 rounded-lg border-2 border-dashed border-[#D9D9D9] bg-[#F5F6FA] py-10"
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                {isDragOver ? (
                  "Drop it like it's Hot!"
                ) : (
                  <>
                    <img src={Upload} alt="upload-icon" />
                    <p className="w-full text-center font-semibold text-[#858688]">
                      Drag & Drop or&nbsp;
                      <span className="text-[#209EE3]">Browse</span> File
                    </p>
                  </>
                )}
              </div>
            )}
          </Dropzone>
          <div className="flex max-h-[100px] w-full flex-col items-start justify-start gap-2.5 overflow-auto">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex w-full items-center justify-center gap-5"
              >
                <img src={PlainDoc} alt="plain-doc-icon" className="size-7" />
                <div className="relative flex flex-1 items-center justify-center rounded-lg bg-[#F5F6FA] p-2.5">
                  <div
                    onClick={() => {
                      setToggledID(file.id);
                      setShow(!show);
                    }}
                    className="flex w-full items-center justify-center"
                  >
                    <span className="w-full flex-1 text-left text-xs">
                      {file.name ? file.name : "Enter Document Type"}
                    </span>
                    <img
                      src={ChevronDown}
                      alt="chevron-down-icon"
                      className="size-3"
                    />
                  </div>
                  {toggledID === file.id && show ? (
                    <div
                      ref={showRef}
                      className="absolute top-10 z-10 flex w-full flex-col items-center justify-center rounded-lg border bg-white shadow-md"
                    >
                      {fileTypes.map((type) => (
                        <span
                          key={type.id}
                          onClick={() => setFileType(type.name, file.id)}
                          className="w-full p-2.5 text-left text-xs font-medium hover:bg-gray-100"
                        >
                          {type.name}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
                <button type="button" onClick={() => removeImage(file.id)}>
                  <img src={GrayX} alt="icon" />
                </button>
                <img src={Download} alt="icon" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UploadDocumentsModal;
