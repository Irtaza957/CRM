import paperRedClip from "../../assets/icons/red-clip.svg";
import arrowLeft from "../../assets/icons/arrowRight.svg";
import cheverondown from "../../assets/icons/chevron-down.svg";
import sendMessage from "../../assets/icons/sendMessage.svg";
import smileEmoji from "../../assets/icons/smileEmoji.svg";
import paperClip from "../../assets/icons/paperClip.svg";
import IconWhatsapp from "../../assets/icons/whatsapp-colored.svg";
import { cn } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";

const chat = [
  {
    isSender: true,
    message:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry’s standard dummy text",
  },
  {
    isSender: false,
    message:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry’s standard dummy text",
  },
  {
    isSender: true,
    message:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry’s standard dummy text",
  },
  {
    isSender: false,
    message:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry’s standard dummy text",
  },
  {
    isSender: false,
    message:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry’s standard dummy text",
  },
  {
    isSender: false,
    message:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry’s standard dummy text",
  },
  {
    isSender: true,
    message:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry’s standard dumm",
  },
  {
    isSender: false,
    message:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry’s standard dummy text",
  },
  {
    isSender: true,
    message:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry’s standard dumm",
  },
  {
    isSender: false,
    message:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry’s standard dummy text",
  },
  {
    isSender: true,
    message:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry’s standard dumm",
  },
  {
    isSender: false,
    message:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry’s standard dummy text",
  },
  {
    isSender: true,
    message:
      "Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry’s standard dumm",
  },
];
const LeadChatBox = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/leads');
  }

  return (
    <div className="flex size-full flex-col overflow-hidden rounded-2xl border border-[#E3E3E3]">
      {/* heading */}
      <div className="flex justify-between bg-white px-4 xl:px-6 py-4">
        <div className="flex items-center gap-2 xl:gap-5">
          <div className="size-[40px] xl:size-[54px] overflow-hidden rounded-full bg-[#F5F6FA]">
            {/* <img src="" alt="" /> */}
          </div>
          <div className="">
            <h3 className="text-lg xl:text-xl font-medium">Sandeep Dev</h3>
            <p className="text-[#9FA2AA] text-sm">+971 55 755 9446</p>
          </div>
        </div>
        <div className="flex items-center gap-5 xl:gap-8">
          <div className="flex size-[54px] items-center justify-center overflow-hidden rounded-full bg-[#F5F6FA]">
            <img src={paperRedClip} alt="" className="w-8 h-8" />
          </div>
          <button onClick={handleBack} className="flex items-center gap-3 rounded-[10px] bg-[#126FAC] px-3 xl:px-5 py-2 text-white">
            <div>
              <img src={arrowLeft} alt="" className="rotate-180 transform w-5 h-5" />
            </div>
            Back
          </button>
        </div>
      </div>
      {/* chat */}
      <div className="w-full bg-[#F4F4F4] pb-[14px] pt-8 px-0 xl:px-6 relative">
        <div className="flex flex-col gap-3 h-[calc(100vh-200px)] px-4 xl:px-0 pb-40 overflow-y-auto">
          {chat.map((item, index) => (
            <div
              key={index}
              className={cn("flex w-[85%] xl:w-[60%] flex-col gap-3", {
                "self-end": !item.isSender,
              })}
            >
              <div className="rounded-[22px] bg-white px-[18px] py-3">
                {item.isSender && (
                  <p className="mb-2.5 w-fit rounded-full bg-[#50C878] px-5 py-1 text-sm text-white">
                    followup
                  </p>
                )}
                <div className="flex items-start gap-3">
                  <img src={IconWhatsapp} alt="" className="size-9" />
                  <p className="w-full text-sm">
                    {item.message}
                  </p>
                </div>
              </div>
              <p
                className={cn("w-fit text-[#9FA2AA]", {
                  "self-end": item.isSender,
                })}
              >
                Jan 12, 10:45 am
              </p>
            </div>
          ))}
        </div>
        {/* chat input */}
        <div className="sticky -bottom-0.5 left-0 w-full flex h-[146px] gap-3 rounded-[18px] border border-[#E3E3E3] bg-white p-2.5">
          <div className="w-[200px]">
            <div className="flex w-full cursor-pointer items-center justify-between rounded-[10px] text-sm bg-[#F3F5F9] px-5 py-2.5">
              Select Channel
              <img src={cheverondown} alt="" className="size-4" />
            </div>
          </div>
          <div className="flex h-full flex-1 flex-col gap-1 rounded-[10px] border border-[#E4EBF2] bg-[#F5F6FA] p-3">
            <textarea
              name="message"
              id=""
              className="flex-1 bg-transparent text-sm"
            ></textarea>
            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <img src={smileEmoji} alt="" className="size-6 cursor-pointer" />
                <img src={paperClip} alt="" className="size-6 cursor-pointer" />
              </div>
              <div className="cursor-pointer rounded-lg bg-[#126FAC] px-6 py-2.5">
                <img src={sendMessage} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadChatBox;
