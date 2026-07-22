if (!window.APP_CONFIG?.apiUrl) {
    throw new Error('API_URL is not configured');
}

export const API_URL = window.APP_CONFIG.apiUrl.replace(/\/$/, '');
