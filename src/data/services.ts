import type {ApiService, Service} from '../types'

const API_URL = import.meta.env.VITE_SERVICES_API_URL ?? 'https://server.morellijoseph.com/api/admin/lux/services'

const categoryById: Record<number, string> = {
    1: 'Lashes',
    2: 'Brows',
    3: 'Waxing',
    4: 'Locs',
    5: 'Hair',
    6: 'Twists',
}

const accentByCategory: Record<string, string> = {
    Lashes: 'rose',
    Brows: 'plum',
    Waxing: 'honey',
    Locs: 'lavender',
    Hair: 'sage',
    Twists: 'sky',
}

function mapApiService(apiService: ApiService): Service {
    const category = categoryById[apiService.category_id] ?? 'Other'
    return {
        id: apiService.id,
        name: apiService.name,
        category,
        description: apiService.description,
        duration: apiService.duration_minutes,
        price: apiService.price,
        accent: accentByCategory[category] ?? 'rose',
    }
}

export async function fetchServices(): Promise<Service[]> {
    const response = await fetch(API_URL)
    if (!response.ok) {
        throw new Error(`Failed to load services: ${response.status} ${response.statusText}`)
    }
    const data = (await response.json()) as ApiService[]
    return data.filter((service) => service.is_active).map(mapApiService)
}

export const categories = ['All', ...new Set(Object.values(categoryById))] as const
