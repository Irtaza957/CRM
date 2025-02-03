import LeadChatBox from "../components/leadDetails/LeadChatBox";
import LeadSideBar from "../components/leadDetails/LeadSideBar";

const LeadDetails = () => {
  return (
    <>
      <div className="w-full h-[calc(100vh-80px)] flex gap-4">
        <div className="w-[50%] xl:w-[40%] h-full overflow-auto rounded-2xl border border-[#E3E3E3] bg-white">
            <LeadSideBar />
        </div>
        <div className="w-[50%] xl:w-[60%]">
            <LeadChatBox />
        </div>
      </div>
    </>
  );
};

export default LeadDetails;
