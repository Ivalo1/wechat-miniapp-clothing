import { get, post } from './request'
export const createReview = (productId, orderId, data) => post(`/mini/review?productId=${productId}&orderId=${orderId}`, data)
export const getProductReviews = (productId, page = 1, size = 10) => get(`/mini/review/product/${productId}`, { page, size })
