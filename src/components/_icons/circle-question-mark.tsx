import type { SVGProps } from 'react';
const SvgCircleQuestionMark = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        className="circle-question-mark_svg__lucide circle-question-mark_svg__lucide-circle-question-mark-icon circle-question-mark_svg__lucide-circle-question-mark"
        viewBox="0 0 24 24"
        {...props}
    >
        <circle cx={12} cy={12} r={10} />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
    </svg>
);
export default SvgCircleQuestionMark;
