import { get } from './request'
export const queryLogistics = (orderNo, company, trackingNo) => get(`/mini/logistics/${orderNo}`, { company, trackingNo })
