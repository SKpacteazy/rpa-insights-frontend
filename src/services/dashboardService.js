
export const DashboardService = (axiosInstance) => {

    const getQueueVolume = async (start, end) => {
        const response = await axiosInstance.get('/dashboard/kpi/volume', { params: { startDate: start, endDate: end } });
        return response.data;
    };

    const getTrend = async (start, end) => {
        const response = await axiosInstance.get('/dashboard/kpi/trend', { params: { startDate: start, endDate: end } });
        return response.data;
    };

    const getStatusDist = async (start, end) => {
        const response = await axiosInstance.get('/dashboard/kpi/status', { params: { startDate: start, endDate: end } });
        return response.data;
    };

    const getAging = async (start, end) => {
        const response = await axiosInstance.get('/dashboard/kpi/aging', { params: { startDate: start, endDate: end } });
        return response.data;
    };

    const getPerformance = async (start, end) => {
        const response = await axiosInstance.get('/dashboard/kpi/performance', { params: { startDate: start, endDate: end } });
        return response.data;
    };

    const getBenchmarking = async (start, end) => {
        const response = await axiosInstance.get('/dashboard/kpi/benchmarking', { params: { startDate: start, endDate: end } });
        return response.data;
    };

    return {
        getQueueVolume,
        getTrend,
        getStatusDist,
        getAging,
        getPerformance,
        getBenchmarking
    };
};
