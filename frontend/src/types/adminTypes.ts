import { ReactNode } from "react";

export type AdminHeaderProps = {
  collapsed: boolean;
  toggleCollapse: () => void;
  isNotifOpen: boolean;
  setIsNotifOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export type AdminSidebarProps = {
  collapsed: boolean;
  children?: ReactNode;
  isNotifOpen?: boolean;
};