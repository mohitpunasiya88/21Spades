import axios from 'axios';
import authRoutes from '@/lib/routes';


 export const apiClient = axios.create({
    // baseURL: "http://localhost:8080/api/",
    baseURL: "http://44.200.78.158:8080/api/",
});

const routes = authRoutes;

apiClient.interceptors.request.use(
    (config:any) => {
        const requiresAuth = config.requiresAuth ?? true;

        // Log API request for debugging
        const fullUrl = `${config.baseURL || ''}${config.url || ''}`
        console.log('🌐 [NETWORK] API Request:', {
            method: config.method?.toUpperCase(),
            url: fullUrl,
            requiresAuth,
            hasToken: !!localStorage.getItem('token')
        })

        // Add Authorization header if required
        if (requiresAuth) {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                console.log('🌐 [NETWORK] Authorization header added')
            } else {
                console.log("🌐 [NETWORK] No token found, proceeding without authorization header.");
            }
        }

        if (config.contentType) {
            config.headers['Content-Type'] = config.contentType;
        }

        return config;
    },
    (error) => {
        console.error('🌐 [NETWORK] Request interceptor error:', error)
        return Promise.reject(error);
    }
);


apiClient.interceptors.response.use(
    (response) => {
        // Log successful API response
        console.log('🌐 [NETWORK] API Response Success:', {
            url: response.config.url,
            status: response.status,
            data: response.data
        })
        return response;
    },
    (error) => {
        // Log API error
        console.error('🌐 [NETWORK] API Response Error:', {
            url: error.config?.url,
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
            data: error.response?.data
        })

        if (error.response) {
            const { status, data } = error.response;
            let errorMessage = 'An error occurred';
            console.log(status, data?.message)

            if (status === 401 || status === 403) {
                errorMessage = data?.message || 'Unauthorized access. Please log in again.';
                localStorage.removeItem('token');
                // Redirect to frontend login page, not API route
                window.location.href = '/login';
            }
            else if (status === 400) {
                errorMessage = data?.message || 'Bad request. Please check the input.';
            }
            else if (status === 500) {
                errorMessage = 'Internal server error. Please try again later.';
            }
            else if (data && data.message) {
                errorMessage = data.message;
            }
            const customError:any = new Error(errorMessage);
            customError.response = error.response;
            return Promise.reject(customError);
        }
        else if (error.request) {
            console.error('🌐 [NETWORK] No response received from server')
            return Promise.reject(new Error('Network error. Please check your connection.'));
        }
        else {
            return Promise.reject(new Error(error.message));
        }
    }
);
