import { ChangeEvent } from "react";
import { cn } from "../../utils/helpers";

const CustomInput = ({
  type = "text",
  label,
  value,
  setter,
  className,
  placeholder,
  register,
  name,
  disabled,
  errorMsg,
  isRequired,
}: CustomInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (type === "number") {
      if (Number(inputValue) >= 0) {
        setter && setter(inputValue);
      }
    } else {
      setter && setter(inputValue);
    }
    register(name)?.onChange?.(e);
  };

  const emailRegister =
    type === "email"
      ? register &&
        register(name, {
          pattern: {
            value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
            message: "Invalid email address",
          },
        })
      : register && register(name);

  return (
    <div className="col-span-1 flex w-full flex-col items-center justify-center space-y-1">
      <label
        htmlFor={label}
        className="w-full text-left text-xs font-medium text-grey100"
      >
        {label}
        {isRequired && <span>*</span>}
      </label>
      <input
        type={type}
        value={value}
        placeholder={errorMsg ? errorMsg : placeholder}
        {...emailRegister}
        disabled={disabled}
        onChange={handleChange}
        className={cn(
          "flex w-full items-center justify-between rounded-lg py-3 px-3.5 text-xs text-gray-500 placeholder:capitalize",
          className,
          [
            errorMsg
              ? "border border-[#FF1C1C] bg-[#FFEBEB] placeholder:text-[#FF0000]"
              : "bg-grey",
          ]
        )}
      />
    </div>
  );
};

export default CustomInput;
