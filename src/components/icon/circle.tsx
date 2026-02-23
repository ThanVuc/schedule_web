export const Circle = (props: React.SVGProps<SVGSVGElement>) => {
    return (
<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeDasharray="60" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12c0 -4.97 4.03 -9 9 -9c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="60;0"/></path></svg>
    );
};