import { useRef, useState } from "react";
import { DateRangePicker } from "react-date-range";
import { MdOutlineCalendarMonth } from "react-icons/md";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import dayjs from "dayjs";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

interface DateRangePickerComponentProps {
  range: { startDate: Date, endDate: Date, key: string }[];
  setRange: (range: { startDate: Date, endDate: Date, key: string }[]) => void;
}

const DateRangePickerComponent = ({ range, setRange }: DateRangePickerComponentProps) => {
  const [toggle, setToggle] = useState(false);
   const rangeRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(rangeRef, () => setToggle(false));

  const handleSelect = (ranges: any) => {
    setRange([ranges.selection]);
  };

  return (
    <div ref={rangeRef} className="relative">
      <button
        className="flex items-center justify-between gap-2 w-full bg-grey150 text-xs text-grey200 h-[44px] px-3 rounded-[10px]"
        onClick={() => setToggle(!toggle)}
      >
        <span className="whitespace-nowrap">
          {dayjs(range[0].startDate).format("DD-MM-YYYY")} -{" "}
          {dayjs(range[0].endDate).format("DD-MM-YYYY")}
        </span>
        <MdOutlineCalendarMonth className="w-6 h-6 text-grey250 font-bold" />
      </button>

      {toggle && (
        <div className="absolute z-50 bg-white border rounded-lg shadow-md p-2 mt-1 right-0 overflow-y-auto max-h-[300px]">
          <DateRangePicker
            onChange={handleSelect}
            // showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            ranges={range}
            rangeColors={["#116FAC"]}
            direction="vertical"
            staticRanges={[]}
            inputRanges={[]}
            className="no-sidebar"
            // scroll={{ enabled: true }}
            // initialFocusedDate={new Date()} // Focus on the current date
            // minDate={new Date(2020, 0, 1)} // Minimum selectable date
            // maxDate={new Date(2030, 11, 31)}
          />
        </div>
      )}
    </div>
  );
};

export default DateRangePickerComponent;