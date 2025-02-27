import PhoneNumber from "../../assets/icons/phone-number.svg";
import PhoneColor from "../../assets/icons/phone-colored.svg";
import WhatsappColor from "../../assets/icons/whatsapp-colored.svg";
import Email from "../../assets/icons/email.svg";
import EmailColor from "../../assets/icons/email-color.svg";
import Flag from "../../assets/icons/flag-black.svg";
import Google from "../../assets/icons/google-black.svg";

const LeadCard = () => {
  return (
    <>
      <div className="rounded-xl border border-[#9878EC]/70 bg-[#F3F5F9] w-[240px]">
        <div className="space-y-2 border-b border-[#EFF1F6] px-4 py-2.5">
          <div className="flex items-center justify-between">
            <p className="text-sm 2xl:text-base font-medium">Sundeep Dev</p>
            <button className="rounded-lg bg-[#25D366] px-5 py-1 text-xs text-white">
              Today
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={PhoneNumber} alt="" />
              <p className="text-sm">+971 55 755 9446</p>
            </div>
            <div className="flex items-center gap-2">
              <img src={PhoneColor} alt="" className="size-5" />
              <img src={WhatsappColor} alt="" className="size-5" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={Email} alt="" />
              <p className="text-sm text-[#2BA3F2]">
                mymail2gmail.com
              </p>
            </div>
            <img src={EmailColor} alt="" className="size-5" />
          </div>
          <div className="flex items-center gap-2">
            <img src={Flag} alt="" />
            <p className="text-sm">Indian</p>
          </div>
          <div className="flex items-center gap-2">
            <img src={Google} alt="" />
            <p className="text-sm">Google</p>
          </div>
        </div>
        <div className="px-4 py-2 flex items-center gap-5">
          <div className="size-10 overflow-hidden rounded-full border border-[#707070]">
            {/* <img src="" alt="" /> */}
          </div>
          <div>
            <p className="text-sm text-[#656565]">Agent</p>
            <p className="">Tanveer</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadCard;
