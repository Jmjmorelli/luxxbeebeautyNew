import type {ApiService, Service, Category, ApiCategory} from '../types'

const API_URL = import.meta.env.VITE_SERVICES_API_URL ?? 'https://server.morellijoseph.com/api/v1/lux/services'

const THEME_ACCENTS = ['rose', 'plum', 'honey', 'lavender', 'sage', 'sky'] as const

function hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i)
        hash |= 0
    }
    return Math.abs(hash)
}

function assignCategoryAccents(categories: Category[]): Record<string, string> {
    const used = new Set<string>()
    const assignment: Record<string, string> = {}
    for (const category of categories) {
        const index = hashString(category.name) % THEME_ACCENTS.length
        let offset = 0
        while (used.has(THEME_ACCENTS[(index + offset) % THEME_ACCENTS.length]) && offset < THEME_ACCENTS.length) {
            offset++
        }
        const accent = THEME_ACCENTS[(index + offset) % THEME_ACCENTS.length]
        used.add(accent)
        assignment[category.name] = accent
    }
    return assignment
}

type ApiResponse = {
    services: ApiService[]
    categories: ApiCategory[]
}

function mapCategoryApiService(apiCategory: ApiCategory): Category {
    return {
        id: apiCategory.id,
        name: apiCategory.name,
        created_at: apiCategory.created_at,
    }
}

function mapApiService(
    apiService: ApiService,
    categoryById: Record<number, string>,
    categoryAccentByName: Record<string, string>,
): Service {
    const category = categoryById[apiService.category_id] ?? 'Other'
    return {
        id: apiService.id,
        name: apiService.name,
        category,
        description: apiService.description,
        duration: apiService.duration_minutes,
        price: apiService.price,
        accent: categoryAccentByName[category] ?? 'rose',
    }
}

export async function fetchServices(): Promise<{ services: Service[]; categories: Category[] }> {
    const response = await fetch(API_URL)
    if (!response.ok) {
        throw new Error(`Failed to load services: ${response.status} ${response.statusText}`)
    }
    const data = (await response.json()) as ApiResponse
    const categories = data.categories.map(mapCategoryApiService)
    const categoryById = Object.fromEntries(categories.map((c) => [c.id, c.name]))
    const categoryAccentByName = assignCategoryAccents(categories)
    const services = data.services
        .filter((service) => service.is_active)
        .map((service) => mapApiService(service, categoryById, categoryAccentByName))
    return {services, categories}
}
