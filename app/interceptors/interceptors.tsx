import axios from 'axios';
import authRoutes from '../routes/route';


 export const apiClient = axios.create({
    // baseURL: import.meta.env.VITE_API_BASE_URL,
    baseURL: "http://localhost:8080/api/",
});

const routes = authRoutes;

apiClient.interceptors.request.use(
    (config:any) => {
        const requiresAuth = config.requiresAuth ?? true;

        // Add Authorization header if required
        if (requiresAuth) {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            } else {
                console.log("No token found, proceeding without authorization header.");
            }
        }

        if (config.contentType) {
            config.headers['Content-Type'] = config.contentType;
        }

        // console.log(config)
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
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
            return Promise.reject(new Error('Network error. Please check your connection.'));
        }
        else {
            return Promise.reject(new Error(error.message));
        }
    }
);
