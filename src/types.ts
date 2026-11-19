export type Service = {
    id: string
    name: string
    category: string
    description: string
    duration: number
    price: number
    accent: string
}

export type Category = {
    id: string
    name: string
    createdAt: string
}

export type ApiCategory = {
    id: string
    name: string
    createdAt: string
}

export type ApiService = {
    id: string
    categoryId: string
    name: string
    priceCents: number
    description: string
    durationMinutes: number
    isActive: boolean
    createdAt: string
}

export type CartItem = {
    serviceId: string
    service: Service
    quantity: number
}

export type Booking = {
    id: string
    service: Service
    date: string
    time: string
    clientName: string
    email: string
}
