import { useEffect, useState } from "react";
import Table from "../components/booking/Table";
import NewBookingModal from "../components/booking/modals/NewBookingModal";
import Combobox from "../components/ui/Combobox";
import { TiArrowSortedDown } from "react-icons/ti";
import { useFetchCompaniesQuery } from "../store/services/company";
import {
  useFetchBookingChannelsQuery,
  useFetchBookingPlatformsQuery,
  useFetchBookingSourcesQuery,
  useFetchBookingsQuery,
} from "../store/services/booking";
import { setDate } from "../store/slices/app";
import { useDispatch, useSelector } from "react-redux";
import CustomDatePicker from "../components/ui/CustomDatePicker";
import dayjs from "dayjs";
import { RootState } from "../store";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IoClose } from "react-icons/io5"

const Requests = () => {
  const [add, setAdd] = useState(false);
  const [id, setID] = useState("");
  const [update, setUpdate] = useState(false);
  const [provider, setProvider] = useState<ListOptionProps | null>(null);
  const [filterArray, setFilterArray] = useState<FilterType[]>([]);
  const [source, setSource] = useState<ListOptionProps | null>(null);
  const [channel, setChannel] = useState<ListOptionProps | null>(null);
  const [platform, setPlatform] = useState<ListOptionProps | null>(null);
  const [pageNum, setPageNum] = useState(1);
  const { date } = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();

  const {
    data: bookingData,
    isLoading: bookingLoading,
    refetch,
  } = useFetchBookingsQuery(
    {
      company_id: provider?.id,
      platform_id: platform?.id,
      channel_id: channel?.id,
      source_id: source?.id,
      booking_status: "1",
      ...(date!==undefined ? { date: dayjs(date || new Date()).format("YYYY-MM-DD") } : {}),
      page: pageNum - 1,
    },
    {
      refetchOnMountOrArgChange: true,
      pollingInterval: 10000, // refetch 30 seconds
    }
  );

  const { data: bookingSourcesData } = useFetchBookingSourcesQuery({});

  const { data: bookingChannelsData } = useFetchBookingChannelsQuery({});
  const { data: bookingPlatformsData } = useFetchBookingPlatformsQuery({});

  const { data: companiesData } = useFetchCompaniesQuery({});

  const removeFilter = (id: string) => {
    const temp: FilterType[] = filterArray.filter((item) => item.id !== id);
    setFilterArray(temp);
  };

  const addFilter = (name: string, id: string) => {
    setFilterArray((prevFilters) => [
      ...prevFilters.filter((filter) => filter.name !== name),
      { name, id },
    ]);
  };

  const handleSelectCompanyFilter = (value: ListOptionProps) => {
    if (provider?.id === value.id) {
      setProvider(null);
      removeFilter(String(value.id) + "-company");
    } else {
      setProvider(value);
      if (value?.id) {
        addFilter("company", String(value.id) + "-company");
      } else {
        const temp: FilterType[] = filterArray.filter(
          (item) => item.name !== "company"
        );
        setFilterArray(temp);
      }
    }
  };

  const handleSetDate = (date: string | Date) => {
    dispatch(setDate(date));
  };

  const incrementDate = (e: React.MouseEvent<SVGAElement>) => {
    e.stopPropagation();
    const newDate = dayjs(date || new Date())
      .add(1, "day")
      .toDate();
    handleSetDate(newDate);
  };

  const decrementDate = (e: React.MouseEvent<SVGAElement>) => {
    e.stopPropagation();
    const newDate = dayjs(date || new Date())
      .subtract(1, "day")
      .toDate();
    handleSetDate(newDate);
  };

  useEffect(() => {
    return () => {
      dispatch(setDate(null));
    };
  }, []);

  console.log(bookingData, "bookingDatabookingData");
  return (
    <div className="flex h-full w-full flex-col items-start justify-start">
      <NewBookingModal
        open={add}
        setOpen={setAdd}
        setUpdate={setUpdate}
        setID={setID}
      />
      <div className="mb-3 grid w-full grid-cols-5 gap-3">
        <Combobox
          value={provider}
          options={companiesData?.map((item) => {
            return { id: item.id, name: item.name };
          })}
          handleSelect={handleSelectCompanyFilter}
          placeholder="Company"
          mainClassName="w-full"
          toggleClassName={`w-full p-3 rounded-lg text-xs bg-white ${!provider?.id && "text-gray-500"}`}
          listClassName="w-full top-[45px] max-h-52 border rounded-lg z-20 bg-white"
          listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
          icon={
            <div>
              <TiArrowSortedDown className="size-5" />
            </div>
          }
          searchInputPlaceholder="Search..."
          searchInputClassName="p-1.5 text-xs"
          isRemoveAllow={true}
        />
        <Combobox
          value={platform}
          options={bookingPlatformsData}
          handleSelect={(value) => setPlatform(value)}
          placeholder="Platforms"
          mainClassName="w-full"
          toggleClassName={`w-full p-3 rounded-lg text-xs bg-white ${!platform?.id && "text-gray-500"}`}
          listClassName="w-full top-[45px] max-h-52 border rounded-lg z-20 bg-white"
          listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
          icon={
            <div>
              <TiArrowSortedDown className="size-5" />
            </div>
          }
          searchInputPlaceholder="Search..."
          searchInputClassName="p-1.5 text-xs"
          isRemoveAllow={true}
        />

        <Combobox
          value={source}
          options={bookingSourcesData}
          handleSelect={(value) => setSource(value)}
          placeholder="Source"
          mainClassName="w-full"
          toggleClassName={`w-full p-3 rounded-lg text-xs bg-white ${!source?.id && "text-gray-500"}`}
          listClassName="w-full top-[45px] max-h-52 border rounded-lg z-20 bg-white"
          listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
          icon={
            <div>
              <TiArrowSortedDown className="size-5" />
            </div>
          }
          searchInputPlaceholder="Search..."
          searchInputClassName="p-1.5 text-xs"
          isRemoveAllow={true}
        />
        <Combobox
          value={channel}
          options={bookingChannelsData}
          handleSelect={(value) => setChannel(value)}
          placeholder="Channel"
          mainClassName="w-full"
          toggleClassName={`w-full p-3 rounded-lg text-xs bg-white ${!channel?.id && "text-gray-500"}`}
          listClassName="w-full top-[45px] max-h-52 border rounded-lg z-20 bg-white"
          listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
          icon={
            <div>
              <TiArrowSortedDown className="size-5" />
            </div>
          }
          searchInputPlaceholder="Search..."
          searchInputClassName="p-1.5 text-xs"
          isRemoveAllow={true}
        />
        <div className="flex items-center justify-center rounded-lg bg-white text-xs text-gray-500 xl:text-sm">
          <CustomDatePicker
            date={date || new Date()}
            setDate={handleSetDate}
            toggleButton={
              <div className="flex items-center justify-center gap-3">
                <FaCalendarAlt />
                {date !== undefined ?
                <div className="flex items-center justify-center gap-2 xl:gap-2">
                  <FaChevronLeft
                    className="cursor-pointer"
                    onClick={decrementDate}
                  />
                  <span>{dayjs(date || new Date()).format("DD MMM YYYY")}</span>
                  <FaChevronRight
                    className="cursor-pointer"
                    onClick={incrementDate}
                  />
                </div>: 'Select Date'}
                {date !== undefined &&(
                  <IoClose
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(setDate(undefined));
                    }}
                    className="h-4 w-4 cursor-pointer"
                  />
                )}
              </div>
            }
          />
        </div>
      </div>
      <Table
        data={bookingData || []}
        isLoading={bookingLoading}
        setPageNum={setPageNum}
        page={pageNum}
        refetch={refetch}
        id={id}
        setID={setID}
        update={update}
        setUpdate={setUpdate}
        isRequests={true}
      />
    </div>
  );
};

export default Requests;
