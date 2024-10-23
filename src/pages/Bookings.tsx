import { useState } from "react";
import { TiArrowSortedDown } from "react-icons/ti";

import Table from "../components/booking/Table";
import SourceDropdown from "../components/booking/dropdowns/Source";
import RegionDropdown from "../components/booking/dropdowns/Region";
import CategoryDropdown from "../components/booking/dropdowns/Category";
import ProviderDropdown from "../components/booking/dropdowns/Provider";
import NewBookingModal from "../components/booking/modals/NewBookingModal";
import ProfessionalDropdown from "../components/booking/dropdowns/Professional";
import BookingStatusDropdown from "../components/booking/dropdowns/BookingStatus";
import PaymentStatusDropdown from "../components/booking/dropdowns/PaymentStatus";

const Bookings = () => {
  const [add, setAdd] = useState(false);
  const [provider, setProvider] = useState<string>("");
  const [category, setCategory] = useState<ListOptionProps | null>(null);

  return (
    <div className="flex h-full w-full flex-col items-start justify-start">
      <NewBookingModal open={add} setOpen={setAdd} />
      <div className="grid w-full grid-cols-4 gap-2.5 xl:grid-cols-8">
        <CategoryDropdown
          value={category}
          placeholder="Category"
          setValue={setCategory}
          searchInputPlaceholder="Search..."
          searchInputClassName="p-1.5 text-xs"
          icon={<TiArrowSortedDown className="size-5" />}
          toggleClassName="w-full shadow-md p-3 rounded-lg text-xs bg-white"
          listClassName="w-full top-[50px] max-h-52 border rounded-lg z-20 bg-white"
          listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
        />
        <SourceDropdown
          icon={<TiArrowSortedDown className="size-5" />}
          toggleClassName="w-full shadow-md p-3 rounded-lg text-xs bg-white"
          listClassName="w-full top-[50px] max-h-52 border rounded-lg z-20 bg-white"
        />
        <RegionDropdown
          icon={<TiArrowSortedDown className="size-5" />}
          toggleClassName="w-full shadow-md p-3 rounded-lg text-xs bg-white"
          listClassName="w-full top-[50px] max-h-52 border rounded-lg z-20 bg-white"
        />
        <ProviderDropdown
          provider={provider}
          setProvider={setProvider}
          icon={<TiArrowSortedDown className="size-5" />}
          toggleClassName="w-full shadow-md p-3 rounded-lg text-xs bg-white"
          listClassName="w-full top-[50px] max-h-52 border rounded-lg z-20 bg-white"
        />
        <ProfessionalDropdown
          icon={<TiArrowSortedDown className="size-5" />}
          toggleClassName="w-full shadow-md p-3 rounded-lg text-xs bg-white"
          listClassName="w-full top-[50px] max-h-52 border rounded-lg z-20 bg-white"
        />
        <BookingStatusDropdown
          searchInputPlaceholder="Search..."
          searchInputClassName="p-1.5 text-xs"
          icon={<TiArrowSortedDown className="size-5" />}
          toggleClassName="w-full shadow-md p-3 rounded-lg text-xs bg-white"
          listClassName="w-full top-[50px] max-h-52 border rounded-lg z-20 bg-white"
          listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
        />
        <PaymentStatusDropdown
          searchInputPlaceholder="Search..."
          searchInputClassName="p-1.5 text-xs"
          icon={<TiArrowSortedDown className="size-5" />}
          toggleClassName="w-full shadow-md p-3 rounded-lg text-xs bg-white"
          listClassName="w-full top-[50px] max-h-52 border rounded-lg z-20 bg-white"
          listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
        />
        <button
          type="button"
          onClick={() => setAdd(true)}
          className="col-span-1 flex w-full cursor-pointer items-center justify-center rounded-lg bg-primary text-center text-sm font-semibold text-white shadow-md"
        >
          New Booking
        </button>
      </div>
      <Table />
    </div>
  );
};

export default Bookings;
