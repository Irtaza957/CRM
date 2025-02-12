import { useParams } from "react-router-dom";
import LeadChatBox from "../components/leadDetails/LeadChatBox";
import LeadSideBar from "../components/leadDetails/LeadSideBar";
import { useFetchLeadByIdQuery, useFetchLeadChatQuery } from "../store/services/leads";

const LeadDetails = () => {
  const { id } = useParams()
  
  const {
    data: leadData,
    refetch: refetchLead,
  } = useFetchLeadByIdQuery(id, {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  const {data: leadChatData, refetch: refetchLeadChat}=useFetchLeadChatQuery(id)

  return (
    <>
      <div className="flex h-[calc(100vh-80px)] w-full gap-4">
        <div className="h-full w-[50%] rounded-2xl border border-[#E3E3E3] bg-white xl:w-[40%]">
          <LeadSideBar id={id || ''} leadData={leadData} refetchLead={refetchLead}  refetchLeadChat={refetchLeadChat} />
        </div>
        <div className="w-[50%] xl:w-[60%]">
          <LeadChatBox id={id || ''} leadChatData={leadChatData} stage_id={leadData?.stage_id} clientName={leadData?.client_name} phoneNum={leadData?.phone} refetchLeadChat={refetchLeadChat} />
        </div>
      </div>
    </>
  );
};

export default LeadDetails;
