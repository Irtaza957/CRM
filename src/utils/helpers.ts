import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const createTimelineView = (bookings: BookingProps[]) => {
  const hours = [
    "8AM",
    "9AM",
    "10AM",
    "11AM",
    "12PM",
    "1PM",
    "2PM",
    "3PM",
    "4PM",
    "5PM",
    "6PM",
    "7PM",
    "8PM",
    "9PM",
    "10PM",
    "11PM",
    "12AM",
    "1AM",
    "2AM",
    "3AM",
    "4AM",
    "5AM",
    "6AM",
    "7AM",
  ];

  const timelineView: Record<string, BookingProps[]> = {};

  hours.forEach((hour) => {
    timelineView[hour] = [];
  });

  bookings.forEach((booking) => {
    const [startTime] = booking.schedule_slot.split(" - ");
    const [startHour] = startTime.split(":").map(Number);

    const isPM = startHour >= 12;
    const hourKey = startHour % 12 === 0 ? 12 : startHour % 12;
    const hourLabel = `${hourKey}${isPM ? "PM" : "AM"}`;

    if (timelineView[hourLabel]) {
      timelineView[hourLabel].push(booking);
    }
  });

  return timelineView;
};

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(
    () => {
      toast.success("Copied to Clipboard!");
    },
    () => {
      toast.error("Copy failed. Please try again.");
    }
  );
};

export const extractPositions = (employees: EmployeeProps[]) => {
  const positions = employees.map((employee) => employee.position);
  return [...new Set(positions)];
};

export const groupAndCountItems = (
  arr: {
    code: string;
    color: string;
  }[]
): {
  code: string;
  color: string;
  count: number;
}[] => {
  const resultMap = new Map<
    string,
    {
      code: string;
      color: string;
      count: number;
    }
  >();

  arr.forEach(({ code, color }) => {
    const key = `${code}-${color}`;
    if (resultMap.has(key)) {
      resultMap.get(key)!.count += 1;
    } else {
      resultMap.set(key, { code, color, count: 1 });
    }
  });

  return Array.from(resultMap.values());
};

export const getFilterQuery = (query: { name: string; id: string, value: string }[]) => {
  return query?.map(
    (filter: { name: string; id: string, value: string }) =>
      `${encodeURIComponent(filter.name)}_id=${encodeURIComponent((filter?.id || filter?.value)?.split("-")[0])}`
  ).join("&");
}
