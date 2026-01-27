import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const logError = (context, error) => {
    let detailedMessage = error.message;
    if (error.response) {
        // Server responded with a status code other than 2xx
        if (error.response.data) {
            if (typeof error.response.data === 'object') {
                // specific check for Detail (FastAPI) or Message (Supabase)
                if (error.response.data.detail) detailedMessage = error.response.data.detail;
                else if (error.response.data.message) detailedMessage = error.response.data.message;
                else detailedMessage = JSON.stringify(error.response.data);
            } else {
                detailedMessage = error.response.data;
            }
        }
        console.error(`[${context}] Error:`, detailedMessage, "| Original:", error);
    } else if (error.request) {
        // Request was made but no response received
        console.error(`[${context}] Network Error (No Response):`, error.request);
        detailedMessage = "Network error - check your connection";
    } else {
        // Something occurred in setting up the request
        console.error(`[${context}] Error:`, error.message);
    }
    return detailedMessage;
};

