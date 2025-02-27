import Emoji from "../../assets/icons/smileEmoji.svg";
import SendArrow from "../../assets/icons/chat-arrow.svg";
import PaperClip from "../../assets/icons/paperClip.svg";
import Whatsapp from "../../assets/icons/whatsapp-colored.svg";
import { cn } from "../../utils/helpers";
import { useState } from "react";
import FollowupModal from "./Modals/FollowupModal";

const WhatsappTab = () => {
  const [openFolowup, setOpenFollowup] = useState(false);

  const chatHistory = [
    {
      isSender: false,
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
    {
      isSender: true,
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
    {
      isSender: false,
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
    {
      isSender: true,
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
  ];

  return (
    <>
      <FollowupModal open={openFolowup} setOpen={setOpenFollowup} />

      <section className="flex h-full flex-col overflow-hidden rounded-xl">
        <div className="bg-[#F3F5F9] px-6 py-5 2xl:text-lg">Chat History</div>
        <div className="relative flex flex-1 flex-col gap-3 overflow-y-auto overflow-x-hidden bg-[#F5F6FA]/40 px-3">
          <div className="flex flex-1 flex-col gap-10 overflow-y-auto p-3">
            {chatHistory.map((item) => (
              <>
                <div
                  className={cn(
                    "relative w-full max-w-[650px] rounded-xl px-4 py-3",
                    item.isSender ? "self-end bg-[#CBFFD7]" : "bg-white"
                  )}
                >
                  {!item.isSender && (
                    <p onClick={()=>(setOpenFollowup(true))} className="mb-1 w-fit text-sm rounded-full bg-[#50C878] px-3 py-0.5 text-[white] cursor-pointer mb-2">
                      Followup
                    </p>
                  )}
                  <div className="flex items-center gap-3">
                    {!item.isSender ? (
                      <img src={Whatsapp} alt="Whatsapp" />
                    ) : (
                      <div className="size-10 min-w-10 overflow-hidden rounded-full bg-slate-400"></div>
                    )}
                    <p className="text-sm">{item.text}</p>
                  </div>
                  <div
                    className={cn(
                      "absolute -bottom-6 text-xs text-[#9FA2AA]",
                      item.isSender ? "left-0" : "right-0"
                    )}
                  >
                    <p>Jan 12, 10:45 am</p>
                  </div>
                </div>
              </>
            ))}
          </div>
          <div className="mb-2 flex w-full items-center gap-2 rounded-xl border border-[#E3E3E3] bg-white px-3 py-2">
            <div className="flex items-center gap-2">
              <img src={Emoji} alt="Emoji" className="cursor-pointer w-6 h-6" />
              <img src={PaperClip} alt="PaperClip" className="cursor-pointer w-6 h-6" />
            </div>
            <input type="text" className="flex-1 py-2" />
            <div className="cursor-pointer rounded-lg bg-[#126FAC] px-5 py-2">
              <img src={SendArrow} alt="SendArrow" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WhatsappTab;
