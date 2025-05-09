import { cn } from "../../utils/helpers";

import debounce from "lodash.debounce";
import { LuLoader2 } from "react-icons/lu";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { useCallback, useEffect, useState } from "react";
import { useSearchCustomerMutation } from "../../store/services/customer";

interface AutoCompleteProps {
  handleSelectUser: () => void;
  setSelectedUser: React.Dispatch<React.SetStateAction<CustomerProps | null>>;
}

const AutoComplete = ({ handleSelectUser, setSelectedUser }: AutoCompleteProps) => {
  const [query, setQuery] = useState("");
  const [searchCustomers, { isLoading }] = useSearchCustomerMutation();
  const [results, setResults] = useState<CustomerProps[] | undefined>([]);

  const debouncedFetchData = useCallback(
    debounce(async (value) => {
      if (value) {
        try {
          const data = await searchCustomers(query);
          setResults(data?.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    }, 1000),
    [query]
  );

  useEffect(() => {
    debouncedFetchData(query);
    return () => {
      debouncedFetchData.cancel();
    };
  }, [query, debouncedFetchData]);

  return (
    <div className="relative flex w-full flex-col items-center justify-center">
      <div className="flex w-full items-center justify-center space-x-2.5 rounded-lg bg-gray-100 p-2.5 text-gray-500">
        <input
          type="text"
          value={query}
          placeholder="Search By Mobile No/Customer Name"
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent px-3 text-xs placeholder:italic placeholder:text-gray-500"
        />
        <HiMagnifyingGlass className="h-5 w-5" />
      </div>
      <div className="w-full relative">
        <div
          className={cn(
            "no-scrollbar absolute mt-1 left-0 z-10 flex max-h-[300px] w-full flex-col items-start justify-start overflow-auto rounded-lg border bg-white text-white",
            {
              hidden: query === "",
              "items-center justify-center": results?.length === 0 || isLoading,
            }
          )}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-5 w-full"><LuLoader2 className="h-10 w-10 animate-spin text-secondary" /></div>
          ) : !results?.length ? <p className="text-center text-gray-500 text-xs p-3 w-full">No Results Found!</p> : (
            results?.map((result, index) => (
              <div
                key={result.customer_id}
                onClick={() => {
                  setQuery("");
                  setSelectedUser(result);
                  handleSelectUser()
                }}
                className={cn(
                  "flex w-full cursor-pointer flex-col items-center justify-center py-1.5 px-[18px] hover:bg-[#31B86A] group",
                  {
                    "pb-2.5": index === results?.length - 1,
                    "pt-2.5": index === 0,
                  }
                )}
              >
                <span className="w-full text-left text-[13px] text-grey100 group-hover:text-white">
                  {result.firstname}&nbsp;{result.lastname}&nbsp;&nbsp;{result.phone}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AutoComplete;
