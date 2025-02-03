import { useState } from "react";
import IconArrowRight from ".././../assets/icons/arrowRight.svg";
import { cn } from "../../utils/helpers";
import LeadDetailModal from "./LeadDetailModal";

const LeadSideBar = () => {
  const [tab, setTab] = useState("marketing");
  const [openLeadModal, setOpenLeadModal] = useState(false)

  const clientDetail = [
    { label: "Email", value: "mymail@gmail.com" },
    { label: "County", value: "Indian" },
    { label: "Source", value: "Google" },
    { label: "Priority", value: "High" },
    { label: "Agent", value: "Mehroof" },
    { label: "Stage", value: "New Lead" },
    { label: "Received at", value: "Jan 12, 10:45 am" },
    { label: "Assigned at", value: "Jan 12, 10:47 am" },
    { label: "Last Followup", value: "Jan 12, 10:50 am" },
  ];

  const marketingDetail = [
    { label: "Source", value: "Google" },
    { label: "Channel", value: "WhatsApp" },
    { label: "Ads Name", value: "CityDoctor 50% Off" },
    { label: "Campaign", value: "CityDoctor50" },
    {
      label: "Page Link",
      value: "https://citydoctor.ae/wp-content/uploads/2023/11/",
    },
    { label: "Form Name", value: "Popup 3" },
  ];

  return (
    <>
      <LeadDetailModal
        selectedLead={null}
        open={openLeadModal}
        setOpen={setOpenLeadModal}
        refetch={() => { }}
      // isView={isView}
      // setIsView={setIsView}
      />
      <div className="flex size-full flex-col">
        <div className="flex items-center justify-between border-b border-[#DBDBDB] px-6 py-4">
          <div>
            <p className="text-lg xl:text-xl font-semibold text-[#656565]">Lead Details</p>
            <span className="text-[#9FA2AA] text-sm">(Ref No. 54621)</span>
          </div>
          <div>
            <div className="flex justify-end gap-2">
              <div className="flex flex-col items-end gap-1">
                <span className="rounded-full bg-[#50C878] px-3 xl:px-5 py-1 text-sm text-white">
                  followup
                </span>
                <p className="text-xs text-[#9FA2AA] hidden xl:block">
                  Last Follow up at : Jan 12, 10:45 am
                </p>
              </div>
              <div onClick={() => setOpenLeadModal(true)} className="flex size-10 xl:size-11 cursor-pointer items-center justify-center rounded-full bg-[#126FAC]">
                <img src={IconArrowRight} alt="" className="size-4 xl:size-5" />
              </div>
            </div>
            <p className="text-xs text-[#9FA2AA] xl:hidden">
              Last Follow up at : Jan 12, 10:45 am
            </p>
          </div>
        </div>
        <div className="flex flex-1 flex-col space-y-5 p-6 pt-4">
          <div className="flex justify-between">
            <div className="flex items-center gap-6">
              <div className="size-[54px] rounded-full bg-[#F5F6FA]"></div>
              <div>
                <h4 className="text-xl font-medium">Agent Name</h4>
                <p className="text-[#656565] text-sm">Assigned at : Jan 12, 10:45 am</p>
              </div>
            </div>
            <div>
              <div className="flex -space-x-6">
                <div className="size-11 rounded-full border-2 border-white bg-[#F5F6FA]">
                  {/* <img src="/placeholder.svg" /> */}
                </div>
                <div className="size-11 rounded-full border-2 border-white bg-[#F5F6FA]">
                  {/* <img src="/placeholder.svg" /> */}
                </div>
                <div className="size-11 rounded-full border-2 border-white bg-[#F5F6FA]">
                  {/* <img src="../../assets/icons/userImg.svg" /> */}
                </div>
              </div>
            </div>
          </div>
          {/*  */}
          <div className="flex flex-1 flex-col space-y-4">
            <div className="flex gap-2">
              <button
                onClick={() => setTab("client")}
                className={cn(
                  "w-[calc(50%-4px)] rounded-xl py-3 font-semibold transition-all duration-200 ease-in-out",
                  [
                    tab === "client"
                      ? "bg-[#126FAC] text-white"
                      : "bg-[#F5F6FA] text-[#656565]",
                  ]
                )}
              >
                Client Enquiry
              </button>
              <button
                onClick={() => setTab("marketing")}
                className={cn(
                  "w-[calc(50%-4px)] rounded-xl py-3 font-semibold transition-all duration-200 ease-in-out",
                  [
                    tab === "marketing"
                      ? "bg-[#126FAC] text-white"
                      : "bg-[#F5F6FA] text-[#656565]",
                  ]
                )}
              >
                Marketing
              </button>
            </div>
            <div className="flex-1 rounded-lg bg-[#F5F6FA] px-4 py-4">
              {tab === "client" ? (
                <div className="h-full space-y-[22px]">
                  {clientDetail.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between gap-6 text-[#656565]"
                    >
                      <div className="flex w-1/2 justify-between">
                        <div className="flex items-center gap-6">
                          {/* <img src="" alt="" /> */}
                          {item.label}
                        </div>
                        <p>:</p>
                      </div>
                      <div className="flex-1 text-sm">{item.value}</div>
                    </div>
                  ))}
                  <div className="flex justify-between gap-6 text-[#656565]">
                    <div className="flex items-center gap-6">
                      {/* <img src="" alt="" /> */}
                      <div className="">
                        <p className="">Note</p>
                        <p className="mt-[14px] text-sm">
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry’s standard dummy text
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full space-y-[18px]">
                  {marketingDetail.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between gap-6 text-[#656565]"
                    >
                      <div className="flex w-1/2 justify-between">
                        <div className="flex items-center gap-6">
                          {/* <img src="" alt="" /> */}
                          {item.label}
                        </div>
                        <p>:</p>
                      </div>
                      <div className="flex-1 text-sm">{item.value}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadSideBar;
