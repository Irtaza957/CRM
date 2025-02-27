import { useState } from "react";
import { cn } from "../../utils/helpers";
import CreateMailModal from "./Modals/CreateMailModal";

const EmailTab = () => {
  const [mailType, setMailType] = useState<"mails" | "scheduled" | "drafts">(
    "mails"
  );
  const [openCreateMailModal, setOpenCreateMailModal] = useState(false);

  const rows = new Array(8).fill({
    subject: "abcdeprate*****@gmail.com",
    date: "19 February 2023, 11:00 PM",
    source: "bwhitelist",
    sentBy: "bwhitelist",
    status: "Sent",
  });

  const handleComposeMail = () => {
    setOpenCreateMailModal(true);
  };

  return (
    <>
      <CreateMailModal
        open={openCreateMailModal}
        setOpen={setOpenCreateMailModal}
      />
      <section className="flex h-full flex-col overflow-hidden rounded-xl">
        <div className="flex items-center justify-between bg-[#F3F5F9] px-6 py-3 2xl:text-lg">
          <p>Email</p>
          <button
            onClick={handleComposeMail}
            className="rounded-lg bg-[#126FAC] px-4 py-3 text-sm text-white"
          >
            Compose Email
          </button>
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex gap-10 bg-[#F3F5F9]/40 px-6 pt-3">
            <p
              onClick={() => setMailType("mails")}
              className={cn(
                "w-fit cursor-pointer pb-1 transition-all duration-200 ease-in-out",
                mailType === "mails" && "border-b-2 border-[#126FAC]"
              )}
            >
              Mails
            </p>
            <p
              onClick={() => setMailType("scheduled")}
              className={cn(
                "w-fit cursor-pointer pb-1 transition-all duration-200 ease-in-out",
                mailType === "scheduled" && "border-b-2 border-[#126FAC]"
              )}
            >
              Scheduled
            </p>
            <p
              onClick={() => setMailType("drafts")}
              className={cn(
                "w-fit cursor-pointer pb-1 transition-all duration-200 ease-in-out",
                mailType === "drafts" && "border-b-2 border-[#126FAC]"
              )}
            >
              Drafts
            </p>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="min-w-full divide-y-[2px] divide-[#F3F5F9] border-t-[2px] border-[#F3F5F9]">
              <thead className="bg-[#F3F5F9]/40">
                <tr className="divide-x-[1px] divide-[#E3E3E3] text-left">
                  <th>
                    <label
                      htmlFor="allSelect"
                      className="flex size-full cursor-pointer items-center justify-center px-6 py-5"
                    >
                      <input
                        id="allSelect"
                        type="checkbox"
                        className="peer hidden h-4 w-4"
                      />
                      <div className="size-5 rounded-md border border-[#9FA2AA] bg-white peer-checked:bg-[#126FAC]" />
                    </label>
                  </th>
                  <th className="px-4 py-4 font-medium">Subject</th>
                  <th className="px-4 py-4 font-medium">Date</th>
                  <th className="px-4 py-4 font-medium">Source</th>
                  <th className="px-4 py-4 font-medium">Sent By</th>
                  <th className="px-4 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-x-[2px] divide-[#F3F5F9]">
                {rows.map((row, index) => (
                  <tr
                    key={index}
                    className={cn(
                      "divide-x-[1px] divide-[#E3E3E3] bg-[#F3F5F9]/40 text-sm text-grey500",
                      { "bg-[#F3F5F9]": (index + 1) % 2 === 0 }
                    )}
                  >
                    <td>
                      <label
                        htmlFor={`${index}Select`}
                        className="flex size-full cursor-pointer items-center justify-center px-6 py-5"
                      >
                        <input
                          id={`${index}Select`}
                          type="checkbox"
                          className="peer hidden h-4 w-4"
                        />
                        <div className="size-5 rounded-md border border-[#9FA2AA] bg-white peer-checked:bg-[#126FAC]" />
                      </label>
                    </td>
                    <td className="px-4 py-6">{row.subject}</td>
                    <td className="px-4 py-6">{row.date}</td>
                    <td className="px-4 py-6">{row.source}</td>
                    <td className="px-4 py-6">{row.sentBy}</td>
                    <td className="px-4 py-6">{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default EmailTab;
