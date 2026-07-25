export type Category = 'Hair' | 'Nails' | 'Skin' | 'Lashes'

export type Service = {
  id: string
  name: string
  category: Category
  description: string
  duration: number
  price: number
  accent: string
}

export type Booking = {
  id: string
  service: Service
  date: string
  time: string
  clientName: string
  email: string
}
