import Modal from "../../ui/Modal";
import CustomToast from "../../ui/CustomToast";
import GrayX from "../../../assets/icons/gray-x.svg";
import Upload from "../../../assets/icons/upload.svg";
import Download from "../../../assets/icons/download.svg";
import PlainDoc from "../../../assets/icons/plain-doc.svg";
import { toast } from "sonner";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import Dropzone, { FileRejection } from "react-dropzone";

interface Attachment {
  id: number;
  name: string;
  file: File;
}

const UploadCompanyDocumentsModal = ({ open, setOpen }: ModalProps) => {
  const [files, setFiles] = useState<Attachment[]>([]);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

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
        name: file.name, // Using the file name directly
      };
    });
    setFiles([...final, ...files]);
  };

  const removeImage = (id: number) => {
    setFiles(files.filter((file) => file.id !== id));
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
                    <img src={Upload} alt="upload-icon" className="size-8" />
                    <p className="text-center text-xs font-medium text-grey100">
                      Drag & Drop or&nbsp;
                      <span className="text-[#209EE3]">Browse</span> File
                    </p>
                  </>
                )}
              </div>
            )}
          </Dropzone>
          <div className="flex max-h-[200px] w-full flex-col items-start justify-start gap-2.5 overflow-auto">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex w-full items-center justify-center gap-5"
              >
                <img src={PlainDoc} alt="plain-doc-icon" className="size-7" />
                <div className="flex flex-1 items-center justify-between rounded-lg bg-[#F5F6FA] p-2.5">
                  <span className="w-full flex-1 text-left text-xs">
                    {file.name}
                  </span>
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

export default UploadCompanyDocumentsModal;
