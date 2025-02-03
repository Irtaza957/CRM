import { FieldError, FieldErrorsImpl, Merge, UseFormRegister } from "react-hook-form";
import CustomInput from "./CustomInput"
import flag from "../../assets/icons/flag.svg"
import { RiArrowDownSLine } from "react-icons/ri";

interface CustomPhoneInputProps {
    register: UseFormRegister<any>;
    placeholder?: string;
    label: string;
    name: string;
    isRequired?: boolean;
    errorMsg?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
    isDisabled?: boolean;
}
const CustomPhoneInput = ({ register, placeholder, label, name, isRequired, errorMsg, isDisabled }: CustomPhoneInputProps) => {
    return (
        <div className="relative">
            <CustomInput
                name={name}
                label={label}
                register={register}
                errorMsg={errorMsg}
                placeholder={placeholder || ''}
                disabled={isDisabled}
                isRequired={isRequired}
                className='pl-32'
                type='tel'
            />
            <div className="flex items-center gap-2 absolute left-3 top-7">
                <img src={flag} alt="flag" />
                <RiArrowDownSLine className="size-7 text-grey100" />
                <p className="text-grey200 text-xs -ml-1">+971</p>
            </div>
        </div>
    )
}

export default CustomPhoneInput