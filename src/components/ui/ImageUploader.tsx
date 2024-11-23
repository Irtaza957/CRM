/* eslint-disable @typescript-eslint/no-unused-vars */
import { toast } from "sonner";
import { FiUpload } from "react-icons/fi";
import Dropzone, { FileRejection } from "react-dropzone";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

interface ImageUploaderProps {
  label: string;
  link?: string | undefined;
  disabled?: boolean;
  setImage: Dispatch<SetStateAction<File | string | null>>;
}

const ImageUploader = ({ link, label, setImage, disabled }: ImageUploaderProps) => {
  const [src, setSrc] = useState<string>("");
  const [_, setIsDragOver] = useState<boolean>(false);

  const onDropRejected = (rejectedFiles: FileRejection[]) => {
    const [file] = rejectedFiles;
    setIsDragOver(false);
    if (file.file.size <= 1 * 1024 * 1024) {
      toast.error(`${file.file.type} is not supported.`, {
        description: "Please Choose a PNG, JPG or JPEG file instead.",
        className: "p-2 rounded-lg bg-red-500 text-white",
      });
    } else {
      toast.error("Image Size Exceeds 1MB", {
        description: "Please Choose an Image <= 1MB instead.",
        className: "p-2 rounded-lg bg-red-500 text-white",
      });
    }
  };

  const onDropAccepted = async (acceptedFiles: File[]) => {
    setImage(acceptedFiles[0]);
    setIsDragOver(false);
    setSrc(URL.createObjectURL(acceptedFiles[0]));
  };

  useEffect(() => {
    setSrc(link!);
  }, [link]);

  return (
    <div className="relative col-span-1 flex w-full flex-col items-start justify-start gap-2">
      <Dropzone
        maxFiles={1}
        accept={{
          "image/png": [".png"],
          "image/jpg": [".jpg"],
          "image/jpeg": [".jpeg"],
        }}
        maxSize={1 * 1024 * 1024}
        onDropRejected={onDropRejected}
        onDropAccepted={onDropAccepted}
        onDragEnter={() => setIsDragOver(true)}
        onDragLeave={() => setIsDragOver(false)}
        disabled={disabled}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            className="col-span-1 flex h-[120px] w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary bg-gray-100 text-xs text-gray-500"
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            {src ? (
              <img src={src} alt="image" className="h-full object-contain" />
            ) : (
              <>
                <FiUpload className="h-6 w-6 text-primary" />
                <p className="w-full px-2.5 text-center text-xs">
                  <span className="font-semibold text-primary">Browse</span>
                  &nbsp;or Drag & Drop.
                </p>
              </>
            )}
          </div>
        )}
      </Dropzone>
      <p className="w-full text-center text-xs">{label}</p>
    </div>
  );
};

export default ImageUploader;
