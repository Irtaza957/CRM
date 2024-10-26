import { cn } from "../../utils/helpers";

const CustomInput = ({
  type = 'text',
  label,
  value,
  setter,
  className,
  placeholder,
  register, 
  name
}: CustomInputProps) => {
  return (
    <div className="col-span-1 flex w-full flex-col items-center justify-center space-y-1">
      <label htmlFor={label} className="w-full text-left text-xs text-grey100 font-medium">
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        {...register(name)}
        onChange={(e) => setter && setter(e.target.value)}
        className={cn(
          "flex w-full items-center justify-between rounded-lg bg-grey p-3.5 text-xs text-gray-500 placeholder:capitalize",
          className
        )}
      />
    </div>
  );
};

export default CustomInput;
