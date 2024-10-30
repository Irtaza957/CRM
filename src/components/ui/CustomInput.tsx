import { ChangeEvent } from "react";
import { cn } from "../../utils/helpers";

const CustomInput = ({
  type = 'text',
  label,
  value,
  setter,
  className,
  placeholder,
  register, 
  name,
  disabled
}: CustomInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (type === 'number') {
      if(Number(inputValue) >=0){
        setter && setter(inputValue);
      }
    } else {
      setter && setter(inputValue);
    }
  };

  return (
    <div className="col-span-1 flex w-full flex-col items-center justify-center space-y-1">
      <label htmlFor={label} className="w-full text-left text-xs text-grey100 font-medium">
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        {...(register && name ? register(name) : {})}
        onChange={handleChange}
        className={cn(
          "flex w-full items-center justify-between rounded-lg bg-grey p-3.5 text-xs text-gray-500 placeholder:capitalize",
          className
        )}
      />
    </div>
  );
};

export default CustomInput;
