import { cn } from "../../utils/helpers";

interface CustomButton{
    name: string;
    style?: string;
    handleClick: ()=>void
}
const CustomButton = ({
    name,
    style,
    handleClick
}: CustomButton) => {
    return (
        <button 
            onClick={handleClick}
            className={cn(
                "rounded-md bg-primary px-6 py-2 text-xs text-white",
                style
              )}
        >
            {name}
        </button>
    )
}

export default CustomButton