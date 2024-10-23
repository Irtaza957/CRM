import { cn } from "../../utils/helpers";
import { FieldError, UseFormRegister } from "react-hook-form";

type FormFieldProps = {
  type: string;
  label: string;
  className?: string;
  placeholder: string;
  name: "username" | "password";
  error: FieldError | undefined;
  register: UseFormRegister<FormDataProps>;
};

const FormField = ({
  type,
  name,
  error,
  label,
  register,
  className,
  placeholder,
}: FormFieldProps) => {
  return (
    <div className="col-span-1 flex w-full flex-col items-center justify-center space-y-1">
      <label
        htmlFor={label}
        className="w-full text-left text-xs font-medium text-gray-500"
      >
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className={cn(
          "flex w-full items-center justify-between rounded-lg bg-gray-100 p-3 text-gray-500 placeholder:capitalize",
          className
        )}
      />
      {error && (
        <span className="w-full text-left text-xs text-red-500">
          {error.message}
        </span>
      )}
    </div>
  );
};

export default FormField;
