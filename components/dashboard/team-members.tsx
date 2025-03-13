import React, { useRef } from "react";
import TeamMemberCard from "./components/team-member-cards";
import Image from "next/image";
import Link from "next/link";

const teamProfiles: TeamMember[] = [
  {
    image: "/media/images/profile-1.svg",
    name: "Mike Thomas",
    contact: "123-456-7890",
    reg: "12345",
    email: "mike@example.com",
    id: 1,
    status: true,
    designation: "Manager",
  },
  {
    image: "/media/images/profile-2.svg",
    name: "Tina Jack",
    contact: "234-567-8901",
    reg: "12346",
    email: "tina@example.com",
    id: 2,
    status: true,
    designation: "Developer",
  },
  {
    image: "/media/images/profile-3.svg",
    name: "Tom Mendes",
    contact: "345-678-9012",
    reg: "12347",
    email: "tom@example.com",
    id: 3,
    status: true,
    designation: "Designer",
  },
  {
    image: "/media/images/profile-4.svg",
    name: "Jenny",
    contact: "456-789-0123",
    reg: "12348",
    email: "jenny@example.com",
    id: 4,
    status: true,
    designation: "Developer",
  },
  {
    image: "/media/images/profile-5.svg",
    name: "Thomasan",
    contact: "567-890-1234",
    reg: "12349",
    email: "thomasan@example.com",
    id: 5,
    status: true,
    designation: "Manager",
  },
  {
    image: "/media/images/profile-6.svg",
    name: "Peter Berg",
    contact: "678-901-2345",
    reg: "12350",
    email: "peter@example.com",
    id: 6,
    status: true,
    designation: "Admin",
  },
];

const TeamMemberCards = () => {
  const cardContainerRef = useRef<HTMLDivElement | null>(null);

  const handleArrowClick = (direction: "left" | "right") => {
    if (!cardContainerRef.current) return;

    const scrollAmount = 200;
    const container = cardContainerRef.current;

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="flex flex-row justify-between items-center ">
        <h3 className="font-bold text-xl text-primary-100">Team Members</h3>

        {/* Sticker Profile Images + View All Button */}
        <div className="flex items-center">
          {teamProfiles.slice(0, 5).map((member, idx) => (
            <div
              key={idx}
              className={`w-12 h-12 rounded-full profile-stickers overflow-hidden ${idx !== 0 ? "-ml-2" : ""
                }`}
            >
              <Image
                src={member.image}
                alt={member.name}
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          <button className="ml-3 text-[#4CAD6D] text-sm font-medium underline">
            View All
          </button>
        </div>
      </div>

      {/* Scrollable Team Member Cards */}
      <div className="relative mt-5">
        <div
          className="relative flex gap-5 3xl:gap-10 w-full overflow-x-hidden"
          ref={cardContainerRef}
        >
          {teamProfiles.map((profile, index) => (
            <div
              className="relative flex items-center justify-center min-w-48 bg-tertiary-200 rounded-xl flex-shrink-0"
              key={index}
            >
              <TeamMemberCard {...profile} />
            </div>
          ))}
        </div>

        {/* Scroll Arrows */}
        <div className="absolute right-0 top-[calc(100%+12px)] flex gap-2 z-10">
          <Image
            src="/contractors/images/left-arrow.svg"
            alt="Left Arrow"
            width={20}
            height={20}
            className="cursor-pointer"
            onClick={() => handleArrowClick("left")}
          />
          <Image
            src="/contractors/images/right-arrow.svg"
            alt="Right Arrow"
            width={20}
            height={20}
            className="cursor-pointer"
            onClick={() => handleArrowClick("right")}
          />
        </div>
      </div>
    </>
  );
};

export default TeamMemberCards;
