export const UiPathConfigService = (axiosInstance) => {
    return {
        getConfig: async () => {
            try {
                const response = await axiosInstance.get('/admin/config');
                return response.data;
            } catch (error) {
                console.error("Error fetching configuration:", error);
                throw error;
            }
        },

        updateConfig: async (configData) => {
            try {
                const response = await axiosInstance.put('/admin/config', configData);
                return response.data;
            } catch (error) {
                console.error("Error updating configuration:", error);
                throw error;
            }
        }
    };
};
