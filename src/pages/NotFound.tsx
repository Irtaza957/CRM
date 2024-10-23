import Dead from "../assets/img/404.png";
import { Link } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";

const NotFound = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#F1EFEC]">
      <div className="grid grid-cols-2 gap-x-10">
        <div className="col-span-1 w-full">
          <img src={Dead} alt="404" className="w-full" />
        </div>
        <div className="col-span-1 flex w-full flex-col items-center justify-center">
          <p className="w-full text-left text-7xl font-semibold">Oops!</p>
          <p className="mb-7 mt-2.5 w-full text-left text-xl font-medium text-gray-400">
            We couldn't find what the page
            <br />
            you were looking for.
          </p>
          <Link
            to="/"
            className="mr-auto flex items-center justify-center space-x-3 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white"
          >
            <FaArrowLeftLong />
            <span>Go Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
