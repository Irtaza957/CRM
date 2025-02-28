import EmailRed from "../../assets/icons/email-color.svg";
import EmailBlue from "../../assets/icons/email-blue.svg";
import CartArrow from "../../assets/icons/cart-aroww.svg";
import TikGreen from "../../assets/icons/tik-round-green.svg";

const ActivityHistory = () => {
  return (
    <>
      <section className="flex h-full flex-col overflow-hidden rounded-xl">
        <div className="bg-[#F3F5F9] px-6 py-5 2xl:text-lg font-medium">History</div>
        <div className="flex-1 overflow-y-auto bg-[#F5F6FA]/40 p-6">
          <p className="2xl:text-lg mb-3">Timeline History</p>
          <div>
            <p className="py-2.5 px-10 rounded-lg border border-[#43C383] bg-[#F3F5F9] w-fit text-sm">
            Feb 18, 2025
            </p>
            <div className="w-fit flex flex-col justify-center items-center">
                <div className="w-px bg-[#A7B0C4] h-8" />
                <div className="size-8 relative">
                    <img src={EmailRed} alt="EmailRed" className="size-full" />
                    <div className="absolute w-[330px] left-14 top-1/2 transform -translate-y-1/2">
                        <div className="bg-[#F3F5F9] rounded-xl py-1.5 px-5 relative">
                            <p className="text-sm">
                            Email Bounced for recipient
                            </p>
                            <span className="text-xs text-[#9FA2AA]">
                            Tue, 18 Feb 2025, 09:09 PM
                            </span>
                            <div className="size-5 bg-[#F3F5F9] absolute -left-1.5 top-1/2 transform rotate-45 -translate-y-1/2" />
                        </div>
                    </div>
                </div>
                <div className="w-px bg-[#A7B0C4] h-10" />
                <div className="size-8 relative">
                    <img src={EmailBlue} alt="EmailRed" className="size-full" />
                    <div className="absolute w-[330px] left-14 top-1/2 transform -translate-y-1/2">
                        <div className="bg-[#F3F5F9] rounded-xl py-1.5 px-5 relative">
                            <p className="text-sm">
                            Email Sent
                            </p>
                            <span className="text-xs text-[#9FA2AA]">
                            Tue, 18 Feb 2025, 09:09 PM
                            </span>
                            <div className="size-5 bg-[#F3F5F9] absolute -left-1.5 top-1/2 transform rotate-45 -translate-y-1/2" />
                        </div>
                    </div>
                </div>
                <div className="w-px bg-[#A7B0C4] h-10" />
                <div className="size-8 relative">
                    <img src={CartArrow} alt="EmailRed" className="size-full" />
                    <div className="absolute w-[330px] left-14 top-1/2 transform -translate-y-1/2">
                        <div className="bg-[#F3F5F9] rounded-xl py-1.5 px-5 relative">
                            <p className="text-sm">
                            Lead Created
                            </p>
                            <span className="text-xs text-[#9FA2AA]">
                            Tue, 18 Feb 2025, 09:09 PM
                            </span>
                            <div className="size-5 bg-[#F3F5F9] absolute -left-1.5 top-1/2 transform rotate-45 -translate-y-1/2" />
                        </div>
                    </div>
                </div>
                <div className="w-px bg-[#A7B0C4] h-10" />
                <div className="size-8 relative">
                    <img src={TikGreen} alt="EmailRed" className="size-full" />
                    <div className="absolute w-[330px] left-14 top-1/2 transform -translate-y-1/2">
                        <div className="bg-[#F3F5F9] rounded-xl py-1.5 px-5 relative">
                            <p className="text-sm">
                            Created By    Mehroof
                            </p>
                            <span className="text-xs text-[#9FA2AA]">
                            Tue, 18 Feb 2025, 09:09 PM
                            </span>
                            <div className="size-5 bg-[#F3F5F9] absolute -left-1.5 top-1/2 transform rotate-45 -translate-y-1/2" />
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ActivityHistory;
