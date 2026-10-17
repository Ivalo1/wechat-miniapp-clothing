/** 订单状态 */
export const ORDER_STATUS = {
  PENDING_PAYMENT: 0,
  PAID: 1,
  SHIPPED: 2,
  RECEIVED: 3,
  COMPLETED: 4,
  CANCELLED: 5,
  TIMEOUT_CANCELLED: 6,
  REFUNDING: 7,
  REFUNDED: 8
}

/** 订单状态文字 */
export const ORDER_STATUS_TEXT = {
  0: '待付款', 1: '待发货', 2: '已发货', 3: '已收货',
  4: '已完成', 5: '已取消', 6: '超时取消', 7: '退款中', 8: '已退款'
}

/** 订单状态标签色 */
export const ORDER_STATUS_COLOR = {
  0: 'warning', 1: 'brand', 2: 'brand', 3: 'success',
  4: 'success', 5: 'error', 6: 'error', 7: 'warning', 8: 'error'
}

/** 售后类型 */
export const REFUND_TYPE = {
  1: '仅退款', 2: '退货退款', 3: '换货'
}

/** 售后状态 */
export const REFUND_STATUS_TEXT = {
  0: '待审核', 1: '已同意', 2: '已拒绝', 3: '已退货', 4: '已退款', 5: '已取消'
}

/** 会员等级 */
export const MEMBER_LEVEL_TEXT = {
  0: '普通会员', 1: '银卡会员', 2: '金卡会员', 3: '钻石会员'
}
