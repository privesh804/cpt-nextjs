import React from "react";

const AddProject: React.FC<LogoProps> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="45"
      height="45"
      viewBox="0 0 45 45"
      fill="none"
      {...props}
    >
      <circle cx="22.5" cy="22.5" r="22.5" fill="currentColor" />
      <path
        d="M12 21.8221H33M22.5 11.2656V32.3785"
        stroke="white"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default AddProject;
