import { useState } from "react";
import IconArrowRight from ".././../assets/icons/arrowRight.svg";
import { cn } from "../../utils/helpers";
import LeadDetailModal from "./LeadDetailModal";
import { useFetchNationalityQuery } from "../../store/services/booking";
import dayjs from "dayjs";

const LeadSideBar = ({id, leadData, refetchLead, refetchLeadChat}: {id: string, leadData?: LeadsData, refetchLead: () => void, refetchLeadChat: () => void}) => {
  const [tab, setTab] = useState("client");
  const [openLeadModal, setOpenLeadModal] = useState(false)

  const { data: nationalities } = useFetchNationalityQuery(
    {},
    {
      skip: !open,
      refetchOnMountOrArgChange: true,
    }
  );
  const clientDetail = [
    { label: "Email", value: leadData?.email },
    { label: "County", value: nationalities?.find(item => item.id == Number(leadData?.nationality))?.name },
    { label: "Source", value: leadData?.source },
    { label: "Priority", value: leadData?.priority },
    { label: "Agent", value: leadData?.agent || '-' },
    { label: "Stage", value: leadData?.stage },
    { label: "Received at", value: leadData?.received_at ? dayjs(leadData?.received_at).format('MMM DD, HH:mm A') : '-' },
    { label: "Assigned at", value: leadData?.assigned_at ? dayjs(leadData?.assigned_at).format('MMM DD, HH:mm A') : '-' },
    { label: "Last Followup", value: leadData?.last_followup ? dayjs(leadData?.last_followup).format('MMM DD, HH:mm A') : '-' },
  ];


  const marketingDetail = [
    { label: "Source", value: leadData?.source },
    { label: "Channel", value: leadData?.channel },
    { label: "Ads Name", value: leadData?.adname || '-' },
    { label: "Campaign", value: leadData?.campaign_name || '-' },
    {
      label: "Page Link",
      value: leadData?.page_link || '-' ,
    },

    { label: "Form Name", value: leadData?.form_name || '-' },
  ];

  return (
    <>
      <LeadDetailModal
        selectedLead={id}
        open={openLeadModal}
        setOpen={setOpenLeadModal}
        refetch={refetchLead}
        refetchLeadChat={refetchLeadChat}
      />
      <div className="flex size-full flex-col">
        <div className="flex items-center justify-between border-b border-[#DBDBDB] px-6 py-4">
          <div>
            <p className="text-lg font-semibold text-[#656565]">Lead Details</p>
            <span className="text-grey300 text-xs">(Ref No. {leadData?.reference_no})</span>
          </div>
          <div>
            <div className="flex justify-end gap-2">
              <div className="flex flex-col items-end gap-1">
                <span className="rounded-full bg-[#50C878] px-2 xl:px-5 py-1 text-sm text-white">
                  {leadData?.stage}
                </span>
                <p className="text-xs text-grey300 hidden xl:block whitespace-nowrap">
                  Last Follow up at : {leadData?.last_followup ? dayjs(leadData?.last_followup).format('MMM DD, HH:mm A') : '-'}
                </p>
              </div>
              <div onClick={() => setOpenLeadModal(true)} className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-[#126FAC]">
                <img src={IconArrowRight} alt="" className="size-4" />
              </div>
            </div>
            <p className="text-xs text-grey300 xl:hidden mt-1">
              Last Follow up at : {leadData?.last_followup ? dayjs(leadData?.last_followup).format('MMM DD, HH:mm A') : '-'}
            </p>
          </div>
        </div>
        <div className="flex flex-1 flex-col space-y-3 p-6 pt-4">
          <div className="flex justify-between">
            <div className="flex items-center gap-3">
              <div className="size-[54px] rounded-full bg-[#F5F6FA] "/>
              <div>
                <h4 className="text-lg font-medium">Agent Name</h4>
                <p className="text-[#656565] text-xs">{leadData?.assigned_at ? `Assigned at: ${dayjs(leadData?.assigned_at).format('DD MMM, HH:mm')}` : 'N/A'}</p>
              </div>
            </div>
            {/* <div>
              <div className="flex -space-x-6">
                <div className="size-11 rounded-full border-2 border-white bg-[#F5F6FA]">
                  <img src="/placeholder.svg" />
                </div>
                <div className="size-11 rounded-full border-2 border-white bg-[#F5F6FA]">
                  <img src="/placeholder.svg" />
                </div>
                <div className="size-11 rounded-full border-2 border-white bg-[#F5F6FA]">
                  <img src="../../assets/icons/userImg.svg" />
                </div>
              </div>
            </div> */}
          </div>
          {/*  */}
          <div className="flex flex-1 flex-col space-y-3">
            <div className="flex gap-2">
              <button
                onClick={() => setTab("client")}
                className={cn(
                  "w-[calc(50%-4px)] rounded-xl py-2 font-semibold transition-all duration-200 ease-in-out",
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
                  "w-[calc(50%-4px)] rounded-xl py-2 font-semibold transition-all duration-200 ease-in-out",
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
            <div className={cn(
              "w-full rounded-lg bg-[#F5F6FA] px-4 py-4 overflow-auto mb-2",
              tab === "client" && 'h-[calc(100vh-335px)]'
            )}>
              {tab === "client" ? (
                <div className="h-full space-y-[22px]">
                  {clientDetail.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between gap-6 text-[#656565]"
                    >
                      <div className="flex w-1/2 justify-between">
                        <div className="flex items-center gap-6 text-sm">
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
                      <div className="flex gap-2">
                        <p className="">Note: </p>
                        <p className="mt-0.5 text-sm">
                          {leadData?.description}
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
                        <div className="flex items-center gap-6 text-sm">
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
