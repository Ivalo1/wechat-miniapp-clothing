import { get, post } from './request'
export const guessYouLike = (limit = 20) => get('/mini/recommend/guess-you-like', { limit })
export const recordBehavior = (productId, type) => post(`/mini/recommend/behavior?productId=${productId}&type=${type}`)
