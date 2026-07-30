export type Category = string

export type Service = {
  id: string
  name: string
  category: Category
  description: string
  duration: number
  price: number
  accent: string
}

export type ApiService = {
  id: string
  category_id: number
  name: string
  price: number
  description: string
  duration_minutes: number
  is_active: boolean
  created_at: string
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
