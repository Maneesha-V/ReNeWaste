export interface PaginationInput {
    page: number,
    limit: number,
    search: string,
    filter?: string
    minCapacity?: number,
    maxCapacity?: number,
}
export interface SendOtpResponse {
    message: string; 
}