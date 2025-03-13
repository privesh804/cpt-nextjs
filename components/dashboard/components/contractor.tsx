import Image from "next/image";
import React from "react";
import dots from "@/public/contractors/images/dots.png";
import { Contract } from "@/types/contract";

const Contractor = ({ name, image, content }: Contract) => {
  return (
    <>
      <div className="2xl:p-5 w-full h-full p-2.5 flex flex-col justify-center items-center   ">
        <div className="flex justify-center items-center h-[100px]">
          <Image
            src={image}
            alt="profile image"
            className="w-auto h-full object-cover"
            width={70}
            height={100}
          />
          <Image
            src={dots}
            alt="dots"
            width={6}
            height={6}
            className="absolute top-3 right-3 cursor-pointer"
          />
        </div>

        <b className="text-primary-100 text-sm flex-wrap mt-4  ">{name}</b>
        <span className="text-sm flex-wrap mt-1">{content}</span>
      </div>
    </>
  );
};

export default Contractor;
