import { apiClient } from "../interceptors";
import { AxiosRequestConfig } from "axios";

// Extend AxiosRequestConfig to include custom properties
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
    requiresAuth?: boolean;
    contentType?: string;
}

export const apiCaller = async (
    method: string, 
    url: string, 
    data: any = null, 
    requiresAuth: boolean = true, 
    contentType: string = "application/json"
) => {
    try {
        const config: CustomAxiosRequestConfig = {
            method: method as any,
            url, 
            requiresAuth, // Pass requiresAuth to interceptor
            contentType, // Pass contentType to interceptor
            headers: {},
        };

        // Only include data and Content-Type if data is provided
        // For POST/PUT/PATCH requests without body (like like, share, save), don't send data or Content-Type
        if (data !== null && data !== undefined && (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT' || method.toUpperCase() === 'PATCH')) {
            config.data = data;
            if (config.headers) {
                config.headers['Content-Type'] = contentType;
            }
        }

        const response = await apiClient(config);

        return response.data;
    } catch (error) {
        throw error;
    }
};