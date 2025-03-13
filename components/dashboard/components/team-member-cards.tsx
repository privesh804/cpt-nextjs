import Image from "next/image";
import React from "react";

const TeamMemberCard = ({ name, image, index }: any) => {
  return (
    <div
      key={index}
      className="2xl:p-5 w-full  h-full p-2.5 flex flex-col justify-center items-center"
    >
      <div className="flex justify-center items-center  h-[150px] ml-4">
        <Image
          src={image}
          alt="profile image"
          className="w-auto h-full object-cover"
          width={70}
          height={100}
        />
      </div>
      <h4 className="font-normal text-primary-100 text-sm truncate ">{name}</h4>
    </div>
  );
};

export default TeamMemberCard;
