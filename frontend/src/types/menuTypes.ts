import { ReactNode } from 'react';

export type MenuItemType = {
  key: string;
  icon: ReactNode;
  label: string;
};

export type MenuItemProps = {
  item: MenuItemType;
  collapsed: boolean;
  active: boolean;
  onClick: () => void;
};
