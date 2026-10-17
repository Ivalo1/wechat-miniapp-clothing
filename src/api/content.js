import { get } from './request'
export const getBanners = (position) => get('/mini/content/banners', { position })
export const getAnnouncements = () => get('/mini/content/announcements')
