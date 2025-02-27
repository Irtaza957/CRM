import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import Modal from '../../ui/Modal'
import Thumbnail from '../../../assets/icons/thumbnial.svg'
import Combobox from '../../ui/Combobox'
import { IoMdArrowDropdown, IoMdTime } from 'react-icons/io'
import CustomInput from '../../ui/CustomInput'
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import CustomButton from '../../ui/CustomButton'
import { GrAttachment } from "react-icons/gr";
import { formats, modules } from '../../../utils/constants'

const CreateMailModal = ({ open, setOpen }: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [template, setTemplate] = useState<ListOptionProps | null>(null)
    const [subject, setSubject] = useState<string>('')
    const [mailBody, setMailBody] = useState<string>('')
    const handleClose = () => {
        setOpen(false)
    }
    return (
        <Modal open={open} setOpen={setOpen} className="w-[95%] lg:w-[60%]">
            <div className="flex h-auto w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-white">
                <div className="flex w-full items-center justify-between bg-primary px-5 py-2.5 text-white">
                    <h1 className="text-xl font-medium">New Mail</h1>
                    <div className="flex items-center justify-center gap-2">
                        <IoClose onClick={handleClose} className="h-8 w-8 cursor-pointer" />
                    </div>
                </div>
                <div className="h-full max-h-[80vh] w-full overflow-y-scroll pb-5 relative">
                    <div className='flex items-center justify-between pt-5 px-7'>
                        <div className='flex items-center gap-4'>
                            <img src={Thumbnail} alt="thumbnail" className='w-12 h-12 rounded-full' />
                            <p className='text-sm'>Mehroof@citydoctor.ae</p>
                        </div>
                        <div className='w-[30%]'>
                            <Combobox
                                options={[{ id: 1, name: 'Template 1' }, { id: 2, name: 'Template 2' }]}
                                value={template}
                                onChange={setTemplate}
                                placeholder="Templates"
                                mainClassName="w-full"
                                toggleClassName="w-full p-3 rounded-full text-xs text-blue200 bg-grey150"
                                listClassName="w-full top-[48px] max-h-52 border rounded-lg z-20 bg-white"
                                listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                                icon={<IoMdArrowDropdown className="size-5 text-grey100" />}
                                isSearch={false}
                            />
                        </div>
                    </div>
                    <div className='flex items-center gap-7 border-y border-grey600 py-4 mt-4 px-7'>
                        <p className='text-sm'>To:</p>
                        <div className='bg-grey150 text-sm rounded-full px-4 py-2 flex items-center justify-center'>cutomermail@gmail.com</div>
                    </div>
                    <div className='flex items-center pb-3 mt-3 px-7'>
                        <p className='text-sm'>Subject</p>
                        <div className='w-full -mt-1'>
                            <CustomInput value={subject} setter={setSubject} className='bg-white' />
                        </div>
                    </div>
                    <div className='pb-20 mail-quill'>
                        <ReactQuill
                            value={mailBody || ""}
                            onChange={(value) => setMailBody(value)}
                            style={{ height: "300px" }}
                            modules={modules}
                            formats={formats}
                        />
                    </div>
                    <div className='flex items-center justify-between px-5 bg-white sticky bottom-0 border-t border-grey600 pt-4'>
                        <CustomButton
                            name="Attach"
                            handleClick={handleClose}
                            style="bg-grey150 text-black py-3 rounded-lg"
                            icon={<GrAttachment className='size-5 text-black' />}
                        />
                        <div className='flex items-center gap-2'>
                            <CustomButton
                                name="Schedule"
                                handleClick={handleClose}
                                style="bg-grey150 text-black py-3 rounded-lg"
                                icon={<IoMdTime className='size-5 text-black' />}
                            />
                            <CustomButton
                                name="Send Mail"
                                handleClick={handleClose}
                                style="bg-primary text-white py-3 rounded-lg"
                            />
                        </div>

                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default CreateMailModal