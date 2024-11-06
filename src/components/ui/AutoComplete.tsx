import { cn } from "../../utils/helpers";

import debounce from "lodash.debounce";
import { LuLoader2 } from "react-icons/lu";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { useCallback, useEffect, useState } from "react";
import { useSearchCustomerMutation } from "../../store/services/customer";

interface AutoCompleteProps {
  handleSelectUser: ()=>void;
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
          placeholder="971563302017"
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent text-xs placeholder:italic placeholder:text-gray-500"
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
        {results?.length === 0 || isLoading ? (
          <LuLoader2 className="h-10 w-10 animate-spin text-secondary" />
        ) : (
          results?.map((result) => (
            <div
              key={result.customer_id}
              onClick={() => {
                setQuery("");
                setSelectedUser(result);
                handleSelectUser()
              }}
              className="flex w-full cursor-pointer flex-col items-center justify-center p-1.5 hover:bg-gray-100"
            >
              <p className="w-full text-left text-sm font-semibold text-black">
                {result.firstname}&nbsp;{result.lastname}
              </p>
              <p className="w-full text-left text-xs text-gray-500">
                {result.phone}
              </p>
            </div>
          ))
        )}
      </div>
      </div>
    </div>
  );
};

export default AutoComplete;
