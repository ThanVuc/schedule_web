export const StarIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      viewBox="0 0 24 24"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M9 8c-1.667.667-5.4 2.7-7 5.5m9.5-2.5C9.167 12.333 4 16.4 2 22m10.5-7.5c-1.167 1.167-3.8 4.1-5 6.5" />
        <path
          fill="currentColor"
          d="m14.674 6.45l.673-3.285l2.225 2.51l3.027-.294l-1.768 3.062l1.743 2.639l-3.286-.673l-2.51 2.225l.19-3.156l-3.062-1.768z"
        >
          <animate
            attributeName="opacity"
            values="0.6;1;0.6"
            dur="2s"
            repeatCount="indefinite"
          />
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 15 12; 15 15 12; 0 15 12"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>
      </g>
    </svg>
  );
};
