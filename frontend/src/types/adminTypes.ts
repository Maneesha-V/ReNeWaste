import { ReactNode } from "react";

export type AdminHeaderProps = {
  collapsed: boolean;
  toggleCollapse: () => void;
};
export type AdminSidebarProps = {
  collapsed: boolean;
  children?: ReactNode;
};