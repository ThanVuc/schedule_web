export const CloudIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      viewBox="0 0 24 24"
    >
      <mask id="SVG8gBBidpz">
        <g
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        >
          <path
            strokeDasharray="64"
            strokeDashoffset="64"
            d="M7 19h11c2.21 0 4 -1.79 4 -4c0 -2.21 -1.79 -4 -4 -4h-1v-1c0 -2.76 -2.24 -5 -5 -5c-2.42 0 -4.44 1.72 -4.9 4h-0.1c-2.76 0 -5 2.24 -5 5c0 2.76 2.24 5 5 5Z"
          >
            <animate
              fill="freeze"
              attributeName="stroke-dashoffset"
              dur="2.4s"
              values="64;0"
            />
            <set fill="freeze" attributeName="opacity" begin="2.8s" to="0" />
          </path>

          <g fill="#fff" stroke="none" opacity="0">
            <circle cx="12" cy="10" r="6" />
            <rect width="9" height="8" x="8" y="12" />
            <rect width="15" height="12" x="1" y="8" rx="6" />
            <rect width="13" height="10" x="10" y="10" rx="5" />
            <set fill="freeze" attributeName="opacity" begin="2.8s" to="1" />
          </g>

          <g fill="#000" fillOpacity="0" stroke="none">
            <circle cx="12" cy="10" r="4" />
            <rect width="9" height="6" x="8" y="12" />
            <rect width="11" height="8" x="3" y="10" rx="4" />
            <rect width="9" height="6" x="12" y="12" rx="3" />
            <set
              fill="freeze"
              attributeName="fill-opacity"
              begin="2.8s"
              to="1"
            />
            <animate
              fill="freeze"
              attributeName="opacity"
              begin="2.8s"
              dur="2s"
              values="1;0"
            />
          </g>
        </g>
      </mask>

      <rect width="24" height="24" fill="currentColor" mask="url(#SVG8gBBidpz)" />
    </svg>
  );
};
