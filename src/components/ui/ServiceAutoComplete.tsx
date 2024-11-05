import { cn } from "../../utils/helpers";
import { useFetchServiceListMutation } from "../../store/services/service";

import debounce from "lodash.debounce";
import { LuLoader2 } from "react-icons/lu";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { useCallback, useEffect, useState } from "react";
import CustomToast from "./CustomToast";
import { toast } from "sonner";

interface AutoCompleteProps {
  selectedServices: ServiceProps[] | null;
  isCustomerSelected?: boolean;
  setSelectedServices: (arg0: ServiceProps[])=>void;
}

const ServiceAutoComplete = ({
  selectedServices,
  isCustomerSelected,
  setSelectedServices,
}: AutoCompleteProps) => {
  const [query, setQuery] = useState("");
  const [getServices, { isLoading }] = useFetchServiceListMutation();
  const [results, setResults] = useState<ServiceProps[] | undefined>([]);

  const handleServiceSelection = (service: ServiceProps) => {
    if(!isCustomerSelected){
      toast.custom((t) => (
        <CustomToast
          t={t}
          type="error"
          title="Error"
          message="Please Select Customer!"
        />
      ));
      return
    }
    setQuery("");
    const updatedServices = [...(selectedServices || []), { ...service, qty: 1 }];
    setSelectedServices(updatedServices);
  };

  const debouncedFetchData = useCallback(
    debounce(async () => {
      try {
        const data = await getServices({});
        const filtered = data?.data?.filter((item) =>
          item.service_name.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 1000),
    [query]
  );

  useEffect(() => {
    debouncedFetchData();
    return () => {
      debouncedFetchData.cancel();
    };
  }, [query, debouncedFetchData]);

  return (
    <div className="relative flex w-full flex-col items-center justify-center">
      <div className="mt-2.5 flex w-full items-center justify-center space-x-2.5 rounded-lg bg-gray-100 p-2.5 text-gray-500">
        <input
          type="text"
          value={query}
          placeholder="Search Category / Service"
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent text-xs placeholder:italic placeholder:text-gray-500"
        />
        <HiMagnifyingGlass className="size-5" />
      </div>
      <div
        className={cn(
          "no-scrollbar absolute -bottom-[310px] left-0 z-10 flex h-[300px] w-full flex-col items-start justify-start overflow-auto rounded-lg border bg-white text-white",
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
              key={result.service_id}
              onClick={() => {
                handleServiceSelection(result);
              }}
              className={cn(
                "flex w-full cursor-pointer flex-col items-center justify-center p-1.5 text-gray-500 hover:text-white",
                {
                  "hover:bg-[#31B86A]": result.active === "1",
                  "hover:bg-[#E94235]": result.active === "0",
                }
              )}
            >
              <div className="flex w-full items-center justify-center text-sm">
                <p className="w-full text-left">
                  {result.category_code}:{result.service_name}
                </p>
                <p className="text-right">AED&nbsp;{result.price_with_vat}</p>
              </div>
              <p className="w-full text-[10px]">CD - 105</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ServiceAutoComplete;
