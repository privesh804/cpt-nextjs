import React from "react";

const VerticalArrowIcon: React.FC<LogoProps> = (props) => {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Arrow Tail (Line) */}
      <path
        d="M2 12.5H23"
        stroke="url(#paint0_linear_128_1130)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Arrowhead */}
      <path
        d="M16.5 6.5L23 12.5L16.5 18.5"
        stroke="url(#paint0_linear_128_1130)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Gradient Definition */}
      <defs>
        <linearGradient
          id="paint0_linear_128_1130"
          x1="12.5"
          y1="2.17999"
          x2="12.5"
          y2="23.2929"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#71D467" />
          <stop offset="1" stopColor="#4CAD6D" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default VerticalArrowIcon;
