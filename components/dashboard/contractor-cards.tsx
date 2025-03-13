import React, { useRef } from "react";
import Contractor from "./components/contractor";
import { Contract } from "@/types/contract";
import Image from "next/image";

const contractor: Contract[] = [
  {
    image: "/contractors/images/construction-card1.png",
    name: "A&B Construction",
    content: "Groundworks",
  },
  {
    image: "/contractors/images/construction-card2.png",
    name: "Tim Properties",
    content: "Groundworks",
  },
  {
    image: "/contractors/images/construction-card3.png",
    name: "Anaya Housing",
    content: "Roofing",
  },
  {
    image: "/contractors/images/construction-card4.png",
    name: "Construct and co.",
    content: "Scaffolding",
  },
  {
    image: "/contractors/images/construction-card5.png",
    name: "El and Bricks ",
    content: "Roofing",
  },
];

const ContractorCard = () => {
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
      <div className="relative m-5">
        <div
          className="relative flex gap-5 3xl:gap-10 w-full  overflow-x-hidden"
          ref={cardContainerRef}
        >
          {contractor.length > 0
            ? contractor.map((profiles, index) => (
                <div
                  className="relative flex items-center justify-center min-w-48  bg-tertiary-200  rounded-xl flex-shrink-0"
                  key={index}
                >
                  <Contractor {...profiles} />
                </div>
              ))
            : null}
        </div>
        <div className="absolute right-0 top-[calc(100%+12px)] flex gap-2 z-10 mr-0">
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

export default ContractorCard;
