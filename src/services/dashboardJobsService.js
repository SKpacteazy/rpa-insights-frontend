
export const DashboardJobsService = (axiosInstance) => {
    return {
        getJobsSnapshot: async (startDate, endDate) => {
            const response = await axiosInstance.get('/dashboard/jobs/snapshot', {
                params: { startDate, endDate }
            });
            return response.data;
        },
        getJobsDistribution: async (startDate, endDate) => {
            const response = await axiosInstance.get('/dashboard/jobs/distribution', {
                params: { startDate, endDate }
            });
            return response.data;
        },
        getJobsTrend: async (startDate, endDate, interval = 'HOUR') => {
            const response = await axiosInstance.get('/dashboard/jobs/trend', {
                params: { startDate, endDate, interval }
            });
            return response.data;
        },
        getJobsPerformance: async (startDate, endDate) => {
            const response = await axiosInstance.get('/dashboard/jobs/performance', {
                params: { startDate, endDate }
            });
            return response.data;
        },
        getJobsReliability: async (startDate, endDate) => {
            const response = await axiosInstance.get('/dashboard/jobs/reliability', {
                params: { startDate, endDate }
            });
            return response.data;
        },
        getJobsFailureReasons: async (startDate, endDate) => {
            const response = await axiosInstance.get('/dashboard/jobs/failures/reasons', {
                params: { startDate, endDate }
            });
            return response.data;
        },
        getJobsByRelease: async (startDate, endDate) => {
            const response = await axiosInstance.get('/dashboard/jobs/release', {
                params: { startDate, endDate }
            });
            return response.data;
        },
        getJobsTriggers: async (startDate, endDate) => {
            const response = await axiosInstance.get('/dashboard/jobs/triggers', {
                params: { startDate, endDate }
            });
            return response.data;
        },
        getJobsRisk: async (thresholdHours = 24) => {
            const response = await axiosInstance.get('/dashboard/jobs/risk', {
                params: { threshold_hours: thresholdHours }
            });
            return response.data;
        },
        getRecentFailedJobs: async (limit = 10) => {
            const response = await axiosInstance.get('/dashboard/jobs/failures/recent', {
                params: { limit }
            });
            return response.data;
        }
    };
};

