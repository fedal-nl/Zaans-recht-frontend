/**
 * Configuration for the Zaans Recht Frontend API
 * This file allows easy configuration of API settings
 */

// API Configuration
window.API_CONFIG = {
    // Base URL for the API - change this to match your backend deployment
    baseUrl: 'http://localhost:3000/api',
    
    // Alternative configurations for different environments
    environments: {
        development: 'http://localhost:3000/api',
        staging: 'https://staging-api.zaansrecht.nl/api',
        production: 'https://api.zaansrecht.nl/api'
    },
    
    // Request timeout in milliseconds
    timeout: 30000,
    
    // Retry configuration
    retries: {
        enabled: false,
        maxAttempts: 3,
        delay: 1000
    }
};

// Set the API base URL based on current environment
// You can override this by setting window.API_BASE_URL before loading the API module
if (!window.API_BASE_URL) {
    // Auto-detect environment based on hostname
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        window.API_BASE_URL = window.API_CONFIG.environments.development;
    } else if (hostname.includes('staging')) {
        window.API_BASE_URL = window.API_CONFIG.environments.staging;
    } else {
        window.API_BASE_URL = window.API_CONFIG.environments.production;
    }
}