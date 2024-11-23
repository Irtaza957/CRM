import { TiArrowSortedDown } from "react-icons/ti";

import Combobox from "../../ui/Combobox";

const BranchDropdown = ({
  branchesData,
  branch,
  handleSelectBranch
}: {
  branchesData?: ListOptionProps[],
  branch: ListOptionProps | null,
  handleSelectBranch: (ar0: ListOptionProps)=>void
}) => {
  
  return (
    <Combobox
      value={branch}
      handleSelect={handleSelectBranch}
      placeholder="Branch"
      mainClassName="col-span-1 w-full"
      options={branchesData}
      searchInputPlaceholder="Search..."
      searchInputClassName="p-1.5 text-xs"
      defaultSelectedIconClassName="size-4"
      icon={<div><TiArrowSortedDown className="size-5" /></div>}
      toggleClassName={`w-full shadow-md p-3 rounded-lg text-xs bg-white ${!branch?.id && 'text-gray-500'}`}
      listClassName="w-full top-[45px] max-h-52 border rounded-lg z-20 bg-white"
      listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
      isRemoveAllow={true}
    />
  );
};

export default BranchDropdown;
