export type AddUserRatingReq = {
    userId: string;
    data: {
        rating: number;
        comment?: string;
    }
}

