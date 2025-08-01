import { ReactNode } from "react";

export interface ProtectedRouteProps {
    allowedRoles: string[];
}
export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface BreadcrumbsProps {
  paths: BreadcrumbItem[];
  fullWidth?: boolean;
}
export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}
export type MainContentProps = {
  children: ReactNode;
};
export type NotificationBadgeProps = {
    count: number;
};
