import React from "react";

export const DocumentIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"><path strokeDasharray="64" strokeWidth="2" d="M13 3l6 6v12h-14v-18h8"><animate fill="freeze" attributeName="strokeDashoffset" dur="0.6s" values="64;0"/></path><path strokeDasharray="14" strokeDashoffset="14" d="M12.5 3v5.5h6.5"><animate fill="freeze" attributeName="strokeDashoffset" begin="0.7s" dur="0.2s" to="0"/></path></g></svg>
  );
};
