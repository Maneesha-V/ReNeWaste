import { ReactNode } from "react";

export interface PaginationPayload {
  page: number;
  limit: number;
  search: string;
}
export interface ProtectedRouteProps {
    allowedRoles: string[];
}
export interface BreadcrumbItem {
  label: string;
  path?: string;
}
// export interface BreadcrumbsProps {
//   paths: BreadcrumbItem[];
// }
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
export interface PaginationSearchProps {
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onSearchChange: (search: string) => void;
  searchValue: string;
}