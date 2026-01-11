export const DashboardService = (axiosInstance) => ({
    // Get Queue Volume KPI
    getQueueVolume: async () => {
        try {
            const response = await axiosInstance.get('/dashboard/kpi/volume');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
});
