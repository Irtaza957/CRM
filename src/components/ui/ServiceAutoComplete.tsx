import { cn } from "../../utils/helpers";
import { useFetchServiceListMutation } from "../../store/services/service";

import { LuLoader2 } from "react-icons/lu";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { useEffect, useState } from "react";
import CustomToast from "./CustomToast";
import { toast } from "sonner";

interface AutoCompleteProps {
  selectedServices: ServiceProps[] | null;
  isCustomerSelected?: boolean;
  open?: boolean;
  setSelectedServices: (arg0: ServiceProps[]) => void;
}

const ServiceAutoComplete = ({
  selectedServices,
  isCustomerSelected,
  open,
  setSelectedServices,
}: AutoCompleteProps) => {
  const [query, setQuery] = useState("");
  const [services, setServices] = useState<ServiceProps[] | null>(null);
  const [getServices, { isLoading }] = useFetchServiceListMutation();
  const [results, setResults] = useState<ServiceProps[] | undefined>([]);

  const handleServiceSelection = (service: ServiceProps) => {
    if (!isCustomerSelected) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          type="error"
          title="Error"
          message="Please Select Customer!"
        />
      ));
      return;
    }
    setQuery("");
    const updatedServices = [
      ...(selectedServices || []),
      { ...service, qty: 1 },
    ];
    setSelectedServices(updatedServices);
  };

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();

    const filtered = services?.filter(
      (item) =>
        item.service_name.toLowerCase().includes(lowerQuery) ||
        item?.category_code?.toLowerCase().includes(lowerQuery)
    );

    setResults(filtered);
  }, [query, services]);

  useEffect(() => {
    if (open) {
      getServices({}).then((res) => {
        setServices(res?.data || []);
      });
    }
  }, [open]);

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
      <div className="relative w-full">
        <div
          className={cn(
            "no-scrollbar absolute left-0 z-10 mt-1 flex max-h-[300px] w-full flex-col items-start justify-start overflow-auto rounded-lg border bg-white text-white shadow-sm",
            {
              hidden: query === "",
              "items-center justify-center": results?.length === 0 || isLoading,
            }
          )}
        >
          {isLoading ? (
            <LuLoader2 className="h-10 w-10 animate-spin text-secondary" />
          ) : results?.length === 0 ? (
            <p className="text-center text-gray-500 text-xs p-2">
              No Results Found!
            </p>
          ) : (
            results?.map((result, index) => (
              <div
                key={result.service_id}
                onClick={() => {
                  handleServiceSelection(result);
                }}
                className={cn(
                  "flex w-full cursor-pointer flex-col items-center justify-center border-b border-grey50 px-[18px] py-2.5 text-gray-500 hover:text-white",
                  {
                    "hover:bg-[#31B86A]": result.active === "1",
                    "hover:bg-[#E94235]": result.active === "0",
                    "pb-3": index === results?.length - 1,
                    "pt-3": index === 0,
                  }
                )}
              >
                <div className="flex w-full items-center justify-center text-sm">
                  <p className="w-full text-left text-sm">
                    {result.category_code}:{result.service_name}
                  </p>
                </div>
                <div className="flex w-full items-center justify-center">
                  <p className="w-full text-[10px]">{result?.code}</p>
                  <p className="flex w-full justify-end px-1 text-[10px]">
                    AED&nbsp;{Math.floor(Number(result?.price_without_vat))}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceAutoComplete;
