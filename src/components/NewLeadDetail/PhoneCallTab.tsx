import Whatsapp from "../../assets/icons/whatsapp-light-blue.svg";
import { cn } from "../../utils/helpers";

const PhoneCallTab = () => {
  const callHistory = [
    {
      status: "Answered",
      remarks: "NAD + Drip, Asking about bundle",
    },
    {
      status: "Unanswered",
      remarks: "",
    },
    {
      status: "Answered",
      remarks: "NAD + Drip, Asking about bundle",
    },
    {
      status: "Unanswered",
      remarks: "",
    },
  ];

  return (
    <>
      <section className="flex h-full flex-col overflow-hidden rounded-xl">
        <div className="bg-[#F3F5F9] px-6 py-5 2xl:text-lg font-medium">History</div>
        <div className="flex flex-1 flex-col gap-12 overflow-y-auto bg-[#F5F6FA]/40 p-6">
          {callHistory.map((item) => (
            <div className="flex w-fit min-w-[400px] flex-col gap-3 rounded-lg bg-white p-6 relative">
              <div className="flex items-center gap-3">
                <img src={Whatsapp} alt="Whatsapp" />
                <div>
                  <p className="text-sm">Call Ended</p>
                  <span
                    className={cn(
                      "text-xs",
                      item.status === "Answered"
                        ? "text-[#45D06A]"
                        : "text-[#ED1E1E]"
                    )}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
              {item.remarks && (
                <div className="flex items-center gap-4 text-sm">
                  <span>Remarks</span>
                  <p className="rounded-sm py-2 px-4 bg-[#E8F5FF] min-w-[300px]">
                    {item.remarks}
                  </p>
                </div>
              )}
              <div
                    className="absolute -bottom-6 text-[#9FA2AA] right-0 text-xs"
                  >
                    <p>Jan 12, 10:45 am</p>
                  </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default PhoneCallTab;
