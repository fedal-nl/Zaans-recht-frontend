/**
 * API Module for Zaans Recht Frontend
 * Handles communication with the backend API
 */

class ApiClient {
    constructor() {
        // Default API base URL - can be configured via environment or config
        this.baseUrl = this.getApiBaseUrl();
        this.defaultHeaders = {
            'Content-Type': 'application/json',
        };
    }

    /**
     * Get API base URL from environment or use default
     */
    getApiBaseUrl() {
        // Check for environment variable or use default local/dev URL
        return window.API_BASE_URL || 'http://localhost:3000/api';
    }

    /**
     * Generic HTTP request method
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            headers: { ...this.defaultHeaders, ...options.headers },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            
            // Handle HTTP errors
            if (!response.ok) {
                throw new ApiError(
                    `HTTP ${response.status}: ${response.statusText}`,
                    response.status,
                    await this.parseErrorResponse(response)
                );
            }

            // Parse JSON response
            const data = await response.json();
            return data;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            
            // Handle network errors
            throw new ApiError(
                'Network error: Unable to connect to the server',
                0,
                { originalError: error.message }
            );
        }
    }

    /**
     * Parse error response body
     */
    async parseErrorResponse(response) {
        try {
            return await response.json();
        } catch {
            return { message: response.statusText };
        }
    }

    /**
     * Submit contact form data
     */
    async submitContactForm(formData) {
        return this.request('/contact', {
            method: 'POST',
            body: JSON.stringify({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                subject: formData.subject,
                message: formData.message,
                timestamp: new Date().toISOString(),
            }),
        });
    }

    /**
     * Submit appointment booking data
     */
    async submitAppointment(appointmentData) {
        return this.request('/appointments', {
            method: 'POST',
            body: JSON.stringify({
                firstName: appointmentData.firstName,
                lastName: appointmentData.lastName,
                email: appointmentData.email,
                phone: appointmentData.phone,
                legalArea: appointmentData.legalArea,
                date: appointmentData.date,
                time: appointmentData.time,
                type: appointmentData.type,
                description: appointmentData.description,
                timestamp: new Date().toISOString(),
            }),
        });
    }

    /**
     * Get available appointment slots
     */
    async getAvailableSlots(date) {
        return this.request(`/appointments/available?date=${encodeURIComponent(date)}`);
    }

    /**
     * Health check endpoint
     */
    async healthCheck() {
        return this.request('/health');
    }
}

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
    constructor(message, status, details = {}) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.details = details;
    }

    /**
     * Check if error is a network error
     */
    isNetworkError() {
        return this.status === 0;
    }

    /**
     * Check if error is a client error (4xx)
     */
    isClientError() {
        return this.status >= 400 && this.status < 500;
    }

    /**
     * Check if error is a server error (5xx)
     */
    isServerError() {
        return this.status >= 500;
    }
}

// Create a global instance
const apiClient = new ApiClient();

// Export for use in other scripts
window.ApiClient = ApiClient;
window.ApiError = ApiError;
window.apiClient = apiClient;