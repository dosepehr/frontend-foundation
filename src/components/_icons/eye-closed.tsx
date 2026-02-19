import * as React from "react";
import type { SVGProps } from "react";
const SvgEyeClosed = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="eye-closed_svg__lucide eye-closed_svg__lucide-eye-closed-icon eye-closed_svg__lucide-eye-closed"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="m15 18-.722-3.25M2 8a10.645 10.645 0 0 0 20 0M20 15l-1.726-2.05M4 15l1.726-2.05M9 18l.722-3.25" />
  </svg>
);
export default SvgEyeClosed;
