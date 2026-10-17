import { post, del } from './request'
export const addFavorite = (productId) => post(`/mini/favorite/${productId}`)
export const removeFavorite = (productId) => del(`/mini/favorite/${productId}`)
