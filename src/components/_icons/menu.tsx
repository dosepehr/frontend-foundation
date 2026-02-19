import * as React from "react";
import type { SVGProps } from "react";
const SvgMenu = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="menu_svg__lucide menu_svg__lucide-menu-icon menu_svg__lucide-menu"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M4 5h16M4 12h16M4 19h16" />
  </svg>
);
export default SvgMenu;
