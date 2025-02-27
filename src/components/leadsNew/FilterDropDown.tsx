import { useState } from "react";
import PlusIcon from "../../assets/icons/plus.svg";
import MinusIcon from "../../assets/icons/minus.svg";
import { cn } from "../../utils/helpers";

interface Filter {
  name: string;
  id: string;
}

interface FilterDropDownProps {
  leadFilter: { name: string, filters: Filter[] }
}

const FilterDropDown = ({ leadFilter }: FilterDropDownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex cursor-pointer items-center justify-between gap-2 rounded-lg px-4 py-3 text-black transition-all duration-200 ease-in-out text-sm 2xl:text-base hover:bg-[#F3F5F9]",
            { "bg-[#F3F5F9]": isOpen }
          )}
        >
          <p>{leadFilter?.name}</p>
          <img src={!isOpen ? PlusIcon : MinusIcon} alt="Filter Icon" className="size-3 2xl:size-4" />
        </div>
        {isOpen && (
          <div className="rounded-lg bg-[#F3F5F9]/30 px-3 py-1">
            {leadFilter?.filters.map((item: Filter, idx: number) => (
              <label
                htmlFor={`${item.name}${idx}`}
                className="flex cursor-pointer items-center gap-2 text-sm hover:bg-[#F3F5F9] p-3 rounded-lg"
              >
                <input
                  id={`${item.name}${idx}`}
                  type="checkbox"
                  className="peer hidden"
                />
                <span className="size-5 rounded-[5px] border border-[#9FA2AA] bg-white peer-checked:border-blue-500 peer-checked:bg-blue-500"></span>
                {item.name}
              </label>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default FilterDropDown;
