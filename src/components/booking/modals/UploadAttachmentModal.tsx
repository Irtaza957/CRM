import Modal from "../../ui/Modal";
import CustomToast from "../../ui/CustomToast";
import GrayX from "../../../assets/icons/gray-x.svg";
import Upload from "../../../assets/icons/upload.svg";
import PlainDoc from "../../../assets/icons/plain-doc.svg";

import { toast } from "sonner";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import Dropzone, { FileRejection } from "react-dropzone";
import CustomButton from "../../ui/CustomButton";
import Combobox from "../../ui/Combobox";
import { RiArrowDownSLine } from "react-icons/ri";
import { useUploadAttachmentMutation } from "../../../store/services/booking";

interface Attachment {
    id: number;
    name: string;
    file: File;
}

interface AddAddressModalProps {
    open: boolean,
    customerId?: string,
    userId?: number,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    getAttachments: (agr0: string)=>void
}

const fileTypes = [
    {
        id: 1,
        name: "Emirates ID Front",
    },
    {
        id: 2,
        name: "Emirates ID Back",
    },
    {
        id: 3,
        name: "Passport",
    },
    {
        id: 4,
        name: "Insurance",
    }
];

const UploadAttachmentModal = ({ open, customerId, userId, setOpen, getAttachments }: AddAddressModalProps) => {
    const [files, setFiles] = useState<Attachment[]>([]);
    const [isDragOver, setIsDragOver] = useState<boolean>(false);

    const [uploadAttachment, { isLoading }] = useUploadAttachmentMutation();

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
        const final = acceptedFiles.map((file) => {
            return {
                id: Date.now(),
                file,
                name: '',
            };
        });
        setFiles([...final, ...files]);
    };

    const removeImage = (id: number) => {
        setFiles(files.filter((file) => file.id !== id));
    };

    const setFileType = (type: string, fileId: number) => {
        const updatedFiles = files.map(item =>
            item.id === fileId ? { ...item, name: type } : item
        );
        setFiles(updatedFiles);
    };

    const handleSave = async () => {
        try {
            if (customerId && userId) {
                const uploadPromises = files.map(file => {
                    const formData = new FormData();
                    formData.append("user_id", String(userId));
                    formData.append("customer_id", String(customerId));
                    formData.append("source", "customer");
                    formData.append("type", file.name);
                    formData.append("attachment", file.file);
    
                    return uploadAttachment(formData).unwrap();
                });
    
                await Promise.all(uploadPromises);
                getAttachments(customerId)
                setOpen(false);
                setFiles([])
            }
        } catch (error) {
            console.error("Error uploading files:", error);
        }
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
                    <div className="flex w-full flex-col items-start justify-start gap-2.5">
                        {files.map((file) => (
                            <div
                                key={file.id}
                                className="flex w-full items-center justify-center gap-5"
                            >
                                <img src={PlainDoc} alt="plain-doc-icon" className="size-7" />
                                <Combobox
                                    value={{ name: file.name, id: file.id }}
                                    options={fileTypes}
                                    handleSelect={(value) => setFileType(value.name, file.id)}
                                    placeholder="Enter Document Type"
                                    mainClassName="w-full"
                                    toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
                                    listClassName="w-full top-[48px] max-h-48 border rounded-lg z-20 bg-white"
                                    listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                                    icon={<RiArrowDownSLine className="size-5 text-grey100" />}
                                    isSearch={false}
                                />
                                <button type="button" onClick={() => removeImage(file.id)}>
                                    <img src={GrayX} alt="icon" />
                                </button>
                            </div>
                        ))}
                    </div>
                    {files?.some(file=>file.name) ?
                        <div className='flex items-end justify-end gap-3 w-full mt-7'>
                            <CustomButton
                                name='Upload'
                                handleClick={handleSave}
                                loading={isLoading}
                                disabled={isLoading}
                            />
                        </div> : null}
                </div>
            </div>
        </Modal>
    );
};

export default UploadAttachmentModal;