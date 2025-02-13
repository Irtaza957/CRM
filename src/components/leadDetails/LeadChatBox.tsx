import paperRedClip from "../../assets/icons/red-clip.svg";
import arrowLeft from "../../assets/icons/arrowRight.svg";
import cheverondown from "../../assets/icons/chevron-down.svg";
import sendMessage from "../../assets/icons/sendMessage.svg";
import smileEmoji from "../../assets/icons/smileEmoji.svg";
import paperClip from "../../assets/icons/paperClip.svg";
import IconWhatsapp from "../../assets/icons/whatsapp-colored.svg";
import { cn } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
import { leadChannels } from "../../utils/constants";
import Combobox from "../ui/Combobox";
import { useEffect, useRef, useState } from "react";
import { useMoveLeadMutation } from "../../store/services/leads";
import CustomToast from "../ui/CustomToast";
import { toast } from "sonner";
import CustomButton from "../ui/CustomButton";
import { FaFacebookMessenger, FaPhoneAlt } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

const LeadChatBox = ({ id, clientName, leadChatData, stage_id, phoneNum, refetchLeadChat }: { id: string, clientName?: string, leadChatData?: any, stage_id?: string, phoneNum?: string, refetchLeadChat: () => void }) => {
  const [channel, setChannel] = useState({
    id: '',
    name: ''
  })
  const [message, setMessage] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const navigate = useNavigate();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [moveLead, { isLoading }] = useMoveLeadMutation()

  const handleBack = () => {
    navigate('/');
  }

  const handleSelectChannel = (value: any) => {
    setChannel(value)
  }

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji); // Append emoji to the message
  }

  const handleSendMessage = async () => {
    try {
      if (id) {
        const formData = new URLSearchParams();
        formData.append("stage_id", stage_id || '');
        formData.append("lead_id", id);
        formData.append("log_source", channel.id);
        formData.append("notes", message);
        const response = await moveLead(formData)
        if (response.error) {
          toast.custom((t) => (
            <CustomToast
              t={t}
              type="error"
              title="Error"
              message="Something went wrong"
            />
          ));
        } else {
          refetchLeadChat()
          setMessage('')
          setChannel({
            id: '',
            name: ''
          })
        }
      }


    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [leadChatData]);

  return (
    <div className="flex size-full flex-col overflow-hidden rounded-2xl border border-[#E3E3E3]">
      <div className="flex justify-between bg-white px-4 xl:px-6 py-4">
        <div className="flex items-center gap-2 xl:gap-5">
          <div className="size-[40px] xl:size-[54px] overflow-hidden rounded-full bg-[#F5F6FA]" />
          <div className="">
            <h3 className="text-lg font-medium">{clientName || '-'}</h3>
            <p className="text-grey300 text-xs">{phoneNum || '-'}</p>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex size-11 items-center justify-center overflow-hidden rounded-full bg-[#F5F6FA]">
            <img src={paperRedClip} alt="" className="w-6 h-6" />
          </div>
          <button onClick={handleBack} className="flex items-center gap-3 rounded-[10px] bg-[#126FAC] px-3 xl:px-4 py-2 text-white">
            <div>
              <img src={arrowLeft} alt="" className="rotate-180 transform w-4 h-4" />
            </div>
            Back
          </button>
        </div>
      </div>
      {/* chat */}
      <div className="w-full bg-[#F4F4F4] pb-[14px] pt-8 px-0 xl:px-6 relative">
        <div ref={chatContainerRef} className="flex flex-col gap-3 h-[calc(100vh-200px)] px-4 xl:px-0 pb-40 overflow-y-auto">
          {leadChatData?.map((item: { sender_firstname: string, comments: string, created_at: string, stage: string, receiver_image: string, source: string }, index: number) => (
            <div
              key={index}
              className={cn("flex w-[85%] xl:w-[60%] flex-col gap-3", {
                "self-end": !item.sender_firstname,
              })}
            >
              <div className="rounded-[22px] bg-white px-3 py-2">
                <div className="flex items-center gap-2 mb-2">
                  {!item?.receiver_image ? <div className="size-9 overflow-hidden rounded-full bg-[#F5F6FA]"></div> :
                    <img src={item?.receiver_image} alt='' className="size-9 overflow-hidden rounded-full bg-[#F5F6FA]" />}
                  <p className="w-fit rounded-full bg-[#50C878] px-3.5 py-0.5 text-sm text-white">
                    {item?.stage}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  {item?.source === 'WHATSAPP' ?
                    <img src={IconWhatsapp} alt="" className="size-9" /> :
                    <div className={cn(
                      "w-10 h-9 flex items-center justify-center overflow-hidden rounded-full bg-[#ef4b65]",
                      {
                        "bg-[#ef4b65]": item?.source === 'CALL',
                        "bg-[#4285f4]": item?.source === 'EMAIL' || item?.source === 'OTHER',
                        "bg-[#d44abd]": item?.source === 'MESSENGER'
                      }
                      )}>
                      {item?.source === 'CALL' ? 
                        <FaPhoneAlt className="size-5" /> 
                        : item?.source === 'EMAIL' ? <IoMail className="size-5 fill-white" /> 
                        : item?.source === 'MESSENGER' ? <FaFacebookMessenger className="size-5 fill-white" />
                        : <BsThreeDots className="size-5 fill-white" />
                      }
                    </div>
                  }
                  <p className="w-full text-xs mt-2">
                    {item.comments}
                  </p>
                </div>
              </div>
              <p
                className={cn("w-fit text-grey300 text-sm", {
                  "self-end": item.sender_firstname,
                })}
              >
                Jan 12, 10:45 am
              </p>
            </div>
          ))}
        </div>
        {/* chat input */}
        <div className="sticky -bottom-0.5 left-0 w-full flex gap-3 rounded-[18px] border border-[#E3E3E3] bg-white p-2.5">
          <div className="w-[200px]">
            <Combobox
              options={leadChannels}
              value={channel}
              onChange={handleSelectChannel}
              placeholder="Select Channel"
              mainClassName="w-full"
              toggleClassName="flex w-full cursor-pointer items-center justify-between rounded-[10px] text-sm bg-[#F3F5F9] px-5 py-2.5"
              listClassName="w-full top-[-148px] max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              icon={<img src={cheverondown} alt="" className="size-4" />}
              isSearch={false}
            />
          </div>
          <div className="flex h-full flex-1 flex-col gap-1 rounded-[10px] border border-[#E4EBF2] bg-[#F5F6FA] p-3">
            <textarea
              name="message"
              id=""
              className="flex-1 bg-transparent text-sm"
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <div className="relative">
                <img src={smileEmoji} alt="" className="size-6 cursor-pointer" onClick={() => setShowEmojiPicker(false)} />
                {showEmojiPicker && (
                <div className="absolute bottom-10 left-0 z-50">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
                )}
              </div>
              <img src={paperClip} alt="" className="size-6 cursor-pointer" />
              </div>
              <CustomButton
                name={<img src={sendMessage} alt="" />}
                handleClick={handleSendMessage}
                style='cursor-pointer rounded-lg bg-[#126FAC] px-6 py-2.5'
                disabled={!message || !channel.id}
                loading={isLoading}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadChatBox;
