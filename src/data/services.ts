import type { Service } from '../types'

export const services: Service[] = [
  { id: 'silk-press', name: 'Silk Press', category: 'Hair', description: 'A smooth, bouncy finish with deep-conditioning care.', duration: 90, price: 85, accent: 'rose' },
  { id: 'signature-cut', name: 'Signature Cut', category: 'Hair', description: 'A tailored cut and style designed around you.', duration: 60, price: 65, accent: 'plum' },
  { id: 'gel-manicure', name: 'Gel Manicure', category: 'Nails', description: 'A flawless, long-wear manicure with cuticle care.', duration: 50, price: 45, accent: 'honey' },
  { id: 'soft-glam', name: 'Soft Glam', category: 'Skin', description: 'A radiant, camera-ready makeup application.', duration: 75, price: 95, accent: 'lavender' },
  { id: 'classic-set', name: 'Classic Lash Set', category: 'Lashes', description: 'Natural-looking extensions for effortless definition.', duration: 120, price: 110, accent: 'sage' },
  { id: 'hydration-facial', name: 'Hydration Facial', category: 'Skin', description: 'A restorative facial for a fresh, dewy glow.', duration: 60, price: 80, accent: 'sky' },
]

export const categories = ['All', 'Hair', 'Nails', 'Skin', 'Lashes'] as const
