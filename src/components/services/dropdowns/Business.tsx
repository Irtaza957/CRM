import { TiArrowSortedDown } from "react-icons/ti";

import Combobox from "../../ui/Combobox";
import { useFetchBusinessesListQuery } from "../../../store/services/filters";

interface BusinessDropdownProps {
  business: ListOptionProps | null;
  handleSelectBusinessFilter: (value: ListOptionProps) => void;
}

const BusinessDropdown = ({ business, handleSelectBusinessFilter }: BusinessDropdownProps) => {
  const { data: businesses } = useFetchBusinessesListQuery({});

  return (
    <Combobox
      value={business}
      placeholder="Business"
      handleSelect={handleSelectBusinessFilter}
      searchInputPlaceholder="Search..."
      searchInputClassName="p-1.5 text-xs"
      defaultSelectedIconClassName="size-4"
      options={businesses ? businesses : []}
      icon={<TiArrowSortedDown className="size-5" />}
      toggleClassName="w-full shadow-md p-3 rounded-lg text-xs bg-white"
      listClassName="w-full top-[45px] max-h-52 border rounded-lg z-20 bg-white"
      listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
      mainClassName="w-full"
    />
  );
};

export default BusinessDropdown;
