import { useState } from "react";
import { TiArrowSortedDown } from "react-icons/ti";

import Combobox from "../../ui/Combobox";
import { useFetchBranchesQuery } from "../../../store/services/filters";

const BranchDropdown = ({
  company_id,
  emirate_id,
}: {
  company_id: string;
  emirate_id: string;
}) => {
  const { data: branches } = useFetchBranchesQuery(
    {
      emirate_id,
      id: company_id,
    },
    {
      skip:
        !company_id || company_id === "" || emirate_id === "" || !emirate_id,
      refetchOnMountOrArgChange: true,
    }
  );
  const [branch, setBranch] = useState<ListOptionProps | null>(null);

  return (
    <Combobox
      value={branch}
      setValue={setBranch}
      placeholder="Branch"
      mainClassName="col-span-1 w-full"
      options={branches ? branches : []}
      searchInputPlaceholder="Search..."
      searchInputClassName="p-1.5 text-xs"
      defaultSelectedIconClassName="size-4"
      icon={<TiArrowSortedDown className="size-5" />}
      toggleClassName="w-full shadow-md p-3 rounded-lg text-xs bg-white"
      listClassName="w-full top-[50px] max-h-52 border rounded-lg z-20 bg-white"
      listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
    />
  );
};

export default BranchDropdown;
