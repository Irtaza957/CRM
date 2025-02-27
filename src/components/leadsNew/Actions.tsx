import { useState, useRef } from 'react'
import Dots from '../../assets/icons/dots.svg'
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

const Actions = () => {
    const [isActionDropdown, setIsActionDropdown] = useState(false);
    const ref = useRef(null);
    useOnClickOutside(ref, () => setIsActionDropdown(false));
    return (
        <div ref={ref} className="relative">
            <div
                onClick={() => setIsActionDropdown(!isActionDropdown)}
                className="flex cursor-pointer items-center gap-4 rounded-xl bg-[#F3F5F9] px-4 py-3 text-sm 2xl:py-2.5 2xl:text-base"
            >
                <p className="text-nowrap">Actions</p>
                <div className="w-5">
                    <img src={Dots} alt="add lead" />
                </div>
            </div>
            {isActionDropdown && (
                <div className="absolute -right-1 top-[calc(100%+6px)] z-10 flex w-[200px] flex-col gap-0.5 rounded-xl bg-white py-2 shadow-md text-sm 2xl:text-base">
                    <p className="cursor-pointer px-6 py-2.5 hover:bg-gray-50">
                        Mass Email
                    </p>
                    <p className="cursor-pointer px-6 py-2.5 hover:bg-gray-50">
                        Mass SMS
                    </p>
                    <p className="cursor-pointer px-6 py-2.5 hover:bg-gray-50">
                        Mass WhatsApp
                    </p>
                    <p className="cursor-pointer px-6 py-2.5 hover:bg-gray-50">
                        Mass Upload
                    </p>
                </div>
            )}
        </div>
    )
}

export default Actions