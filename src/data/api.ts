/** Base URL for the Commerce Pliris MOS Lux API. */
export const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'https://api.plirismos.com'

export function apiUrl(path: string): URL {
    return new URL(path, API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`)
}
