import { toAbsoluteUrl } from "@/utils/assets";
import Image from "next/image";

const ScreenLoader = () => {
  return (
    <div className="flex flex-col items-center gap-2 justify-center fixed inset-0 z-50 bg-light transition-opacity duration-700 ease-in-out">
      <Image
        className="h-[30px] max-w-none"
        src={toAbsoluteUrl("/media/app/mini-logo.svg")}
        alt="logo"
        width={50}
        height={50}
      />
      <div className="text-gray-500 font-medium text-sm">Loading...</div>
    </div>
  );
};

export { ScreenLoader };
