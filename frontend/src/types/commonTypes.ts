export interface PaginationPayload {
  page: number;
  limit: number;
  search: string;
}
export interface ProtectedRouteProps {
    allowedRoles: string[];
}