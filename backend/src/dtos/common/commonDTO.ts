export interface PaginationInput {
    page: number,
    limit: number,
    search: string,
    minCapacity?: number,
    maxCapacity?: number,
}
export interface SendOtpResponse {
    message: string; 
}