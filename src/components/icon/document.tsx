import React from "react";

export const DocumentIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path
          strokeDasharray="64"
          strokeDashoffset="64"
          d="M13 3l6 6v12h-14v-18h8"
        >
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            dur="0.6s"
            values="64;0"
          />
        </path>
        <path
          strokeDasharray="14"
          strokeDashoffset="14"
          strokeWidth="1"
          d="M12.5 3v5.5h6.5"
        >
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="0.7s"
            dur="0.2s"
            values="14;0"
          />
        </path>
      </g>
      <path
        fill="currentColor"
        fillOpacity="0"
        d="M5 3H12.5V8.5H19V21H5V3Z"
      >
        <animate
          fill="freeze"
          attributeName="fill-opacity"
          begin="1s"
          dur="0.15s"
          values="0;0.3"
        />
      </path>
    </svg>
  );
};
