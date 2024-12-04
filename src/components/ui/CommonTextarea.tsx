import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface CommonTextareaProps {
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors<FieldValues>;
    placeholder: string;
    title: string;
    disabled?: boolean;
    name: string;
    rows?: number;
}

const CommonTextarea = ({ register, errors, name, placeholder, title, disabled, rows }: CommonTextareaProps) => {
    return (
        <div className="col-span-2 my-7 flex w-full flex-col items-center justify-center space-y-1">
            <label
                htmlFor="address"
                className="w-full text-left text-xs font-medium text-grey100"
            >
                {title}
            </label>
            <textarea
                {...register(name)}
                rows={rows || 2}
                className="w-full rounded-lg bg-gray-100 p-3 text-xs text-grey100"
                placeholder={placeholder}
                disabled={disabled}
            />
            {errors?.address?.message && (
                <p className="w-full text-left text-xs text-red-500">
                    {errors?.address?.message as string}
                </p>
            )}
        </div>
    )
}

export default CommonTextarea