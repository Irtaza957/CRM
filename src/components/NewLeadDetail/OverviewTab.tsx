import { BsFlag, BsPerson, BsTag } from "react-icons/bs";
import { CiGlobe, CiMobile3 } from "react-icons/ci";
import { HiOutlineMail } from "react-icons/hi";
import { IoDocumentOutline, IoLanguage } from "react-icons/io5";
import { RiOpenSourceLine, RiStackLine } from "react-icons/ri";
import CustomButton from "../ui/CustomButton";
import CreateNoteModal from "./Modals/CreateNoteModal";
import { useState } from "react";

const OverviewTab = () => {

  const [openCreateNoteModal, setOpenCreateNoteModal ] = useState(false)

  const handleModal = () => {
    setOpenCreateNoteModal(true);
    console.log("bbbb");
    
  };

  return (
    <>
      <CreateNoteModal
        open={openCreateNoteModal}
        setOpen={setOpenCreateNoteModal}
      />
      <div>
        <div className="rounded-xl bg-[#fbfbfd] shadow-sm">
          <div className="rounded-tl-lg rounded-tr-lg bg-grey150 p-4">
            Lead Information
          </div>
          <div className="flex items-center">
            <div className="w-full text-xs">
              <div className="flex items-center gap-5 px-5 py-3">
                <div className="flex w-[130px] items-center justify-between gap-2 text-sm">
                  <div className="flex items-center gap-4">
                    <BsPerson className="size-5" />
                    <span>Name</span>
                  </div>
                  <span>: </span>
                </div>
                <span className="text-grey500 text-sm">Sandeep Dev</span>
              </div>
              <div className="flex items-center gap-5 px-5 py-3">
                <div className="flex w-[130px] items-center justify-between gap-2 text-sm">
                  <div className="flex items-center gap-4">
                    <div>
                      <CiMobile3 className="size-5" />
                    </div>
                    <span>Phone Number</span>
                  </div>
                  <span>: </span>
                </div>
                <span className="text-grey500 text-sm">+971 55 755 9446</span>
              </div>
              <div className="flex items-center gap-5 px-5 py-3">
                <div className="flex w-[130px] items-center justify-between gap-2 text-sm">
                  <div className="flex items-center gap-4">
                    <HiOutlineMail className="size-5" />
                    <span>Email</span>
                  </div>
                  <span>: </span>
                </div>
                <span className="text-grey500 text-sm">mymail@gmail.com</span>
              </div>
              <div className="flex items-center gap-5 px-5 py-3">
                <div className="flex w-[130px] items-center justify-between gap-2 text-sm">
                  <div className="flex items-center gap-4">
                    <div>
                      <BsTag className="size-5" />
                    </div>
                    <span>Service Interest</span>
                  </div>
                  <span>: </span>
                </div>
                <span className="text-grey500 text-sm"> DOC</span>
              </div>
            </div>
            <div className="border-grey600 my-4 w-full border-x text-xs">
              <div className="flex items-center gap-5 px-5 py-3">
                <div className="flex w-[130px] items-center justify-between gap-2 text-sm">
                  <div className="flex items-center gap-4">
                    <BsFlag className="size-5" />
                    <span>Emirate</span>
                  </div>
                  <span>: </span>
                </div>
                <span className="text-grey500 text-sm">Dubai</span>
              </div>
              <div className="flex items-center gap-5 px-5 py-3">
                <div className="flex w-[130px] items-center justify-between gap-2 text-sm">
                  <div className="flex w-full items-center gap-4">
                    <div>
                      <RiStackLine className="size-5" />
                    </div>
                    <span>Pre. Comm Channel</span>
                  </div>
                  <span>: </span>
                </div>
                <span className="text-grey500 text-sm">WhatsApp</span>
              </div>
              <div className="flex items-center gap-5 px-5 py-3">
                <div className="flex w-[130px] items-center justify-between gap-2 text-sm">
                  <div className="flex items-center gap-4">
                    <HiOutlineMail className="size-5" />
                    <span>Gender</span>
                  </div>
                  <span>: </span>
                </div>
                <span className="text-grey500 text-sm">Male</span>
              </div>
              <div className="flex items-center gap-5 px-5 py-3">
                <div className="flex w-[130px] items-center justify-between gap-2 text-sm">
                  <div className="flex items-center gap-4">
                    <div>
                      <IoLanguage className="size-5" />
                    </div>
                    <span>Preferred Language</span>
                  </div>
                  <span>: </span>
                </div>
                <span className="text-grey500 text-sm">English</span>
              </div>
            </div>
            <div className="w-full text-xs">
              <div className="flex items-center gap-5 px-5 py-3">
                <div className="flex w-[130px] items-center justify-between gap-2 text-sm">
                  <div className="flex items-center gap-4">
                    <CiGlobe className="size-5" />
                    <span>Nationality</span>
                  </div>
                  <span>: </span>
                </div>
                <span className="text-grey500 text-sm">Indian</span>
              </div>
              <div className="flex items-center gap-5 px-5 py-3">
                <div className="flex w-[130px] items-center justify-between gap-2 text-sm">
                  <div className="flex items-center gap-4">
                    <RiOpenSourceLine className="size-5" />
                    <span>Source</span>
                  </div>
                  <span>: </span>
                </div>
                <span className="text-grey500 text-sm">Google</span>
              </div>
              <div className="flex items-center gap-5 px-5 py-3">
                <div className="flex w-[130px] items-center justify-between gap-2 text-sm">
                  <div className="flex items-center gap-4">
                    <HiOutlineMail className="size-5" />
                    <span>Channel</span>
                  </div>
                  <span>: </span>
                </div>
                <span className="text-grey500 text-sm">Website</span>
              </div>
              <div className="flex items-center gap-5 px-5 py-3">
                <div className="flex w-[130px] items-center justify-between gap-2 text-sm">
                  <div className="flex items-center gap-4">
                    <IoDocumentOutline className="size-5" />
                    <span>Lead Type</span>
                  </div>
                  <span>: </span>
                </div>
                <span className="text-grey500 text-sm">Company</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-lg border">
          <div className="flex items-center justify-between bg-grey150 p-4">
            <h2 className="text-lg font-medium">Note</h2>
            {/* <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm"></button> */}
            <CustomButton
              name="Create Note"
              handleClick={handleModal}
              style="px-6 py-3 rounded-xl text-sm"
            />
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="px-4 pb-2 pt-4 font-normal">Notes</th>
                <th className="border-grey600 border-x px-4 pb-2 pt-4 font-normal">
                  Date
                </th>
                <th className="px-4 pb-2 pt-4 font-normal">Agent</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              <tr className="border-b">
                <td className="px-4 py-3">
                  Lorem ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry
                </td>
                <td className="border-grey600 border-x px-4 py-3">
                  18 February 2025, 11:58 PM
                </td>
                <td className="px-4 py-3">Mehmod</td>
              </tr>
              <tr className="border-b bg-grey150">
                <td className="px-4 py-3 text-gray-500">
                  Lorem ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry
                </td>
                <td className="border-grey600 px-4 py-3">
                  18 February 2025, 11:58 PM
                </td>
                <td className="px-4 py-3">Mehmod</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 rounded-lg border">
          <div className="flex items-center justify-between bg-grey150 px-4 py-3">
            <h2 className="text-lg font-medium">Attachments</h2>
            <CustomButton
              name="Attach"
              handleClick={() => {}}
              style="px-6 py-3 rounded-xl text-sm"
            />
          </div>
          <div className="h-24"></div>
        </div>
      </div>
    </>
  );
};

export default OverviewTab;
