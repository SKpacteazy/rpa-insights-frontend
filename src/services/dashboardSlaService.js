export const DashboardSlaService = (axiosInstance) => {

    const getSlaCompliance = async (start, end, slaHours = 24) => {
        const response = await axiosInstance.get('/dashboard/sla/compliance', { params: { startDate: start, endDate: end, sla_hours: slaHours } });
        return response.data;
    };

    const getSlaRisk = async (start, end, slaHours = 24) => {
        const response = await axiosInstance.get('/dashboard/sla/risk', { params: { startDate: start, endDate: end, sla_hours: slaHours } });
        return response.data;
    };

    const getExceptionAnalysis = async (start, end) => {
        const response = await axiosInstance.get('/dashboard/quality/exceptions', { params: { startDate: start, endDate: end } });
        return response.data;
    };

    const getRetryMetrics = async (start, end) => {
        const response = await axiosInstance.get('/dashboard/quality/retries', { params: { startDate: start, endDate: end } });
        return response.data;
    };

    const getOperationalRisk = async (start, end) => {
        const response = await axiosInstance.get('/dashboard/risk/operational', { params: { startDate: start, endDate: end } });
        return response.data;
    };

    const getFailuresByQueue = async (start, end) => {
        const response = await axiosInstance.get('/dashboard/quality/failures/queue', { params: { startDate: start, endDate: end } });
        return response.data;
    };

    const getRecentFailures = async (limit = 10) => {
        const response = await axiosInstance.get('/dashboard/quality/failures/recent', { params: { limit } });
        return response.data;
    };

    const getTopFailureReasons = async (start, end) => {
        const response = await axiosInstance.get('/dashboard/quality/failures/reasons', { params: { startDate: start, endDate: end } });
        return response.data;
    };

    const getFailureTrend = async (start, end, interval = 'HOUR') => {
        const response = await axiosInstance.get('/dashboard/quality/failures/trend', { params: { startDate: start, endDate: end, interval } });
        return response.data;
    };

    const getRecentSlaBreaches = async (limit = 10) => {
        const response = await axiosInstance.get('/dashboard/sla/breaches', { params: { limit } });
        return response.data;
    };

    return {
        getSlaCompliance,
        getSlaRisk,
        getExceptionAnalysis,
        getRetryMetrics,
        getOperationalRisk,
        getFailuresByQueue,
        getRecentFailures,
        getTopFailureReasons,

        getFailureTrend,
        getRecentSlaBreaches
    };
};
