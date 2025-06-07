export interface IDashboardService {
    getDashboardData(plantId: string): Promise<any>;
}