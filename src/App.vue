<script setup>
import { onLaunch, onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'

onLaunch(() => {
  console.log('App Launch')
  // 检查登录状态
  const token = uni.getStorageSync('token')
  if (token) {
    const userStore = useUserStore()
    userStore.fetchUserInfo()
  }
})

onShow(() => {
  console.log('App Show')
})
</script>

<style lang="scss">
@import './uni.scss';

page {
  background-color: $bg-page;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', sans-serif;
  font-size: $font-md;
  color: $text-primary;
  line-height: 1.6;
}

// 全局工具类
.container {
  padding: $spacing-md;
}

.card {
  background: $bg-card;
  border-radius: $radius-lg;
  padding: $spacing-md;
  box-shadow: $shadow-sm;
  margin-bottom: $spacing-md;
}

.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

// 价格样式
.price {
  color: $price-color;
  font-weight: 600;
  &-symbol { font-size: $font-sm; }
  &-integer { font-size: $font-xl; }
  &-decimal { font-size: $font-sm; }
}

.price-original {
  color: $text-placeholder;
  font-size: $font-sm;
  text-decoration: line-through;
  margin-left: $spacing-xs;
}

// 按钮样式
.btn-primary {
  background: $brand-primary;
  color: #FFFFFF;
  border: none;
  border-radius: $radius-round;
  padding: $spacing-sm $spacing-xl;
  font-size: $font-md;
  font-weight: 500;
  text-align: center;
  &::after { border: none; }
}

.btn-outline {
  background: transparent;
  color: $brand-primary;
  border: 2rpx solid $brand-primary;
  border-radius: $radius-round;
  padding: $spacing-sm $spacing-xl;
  font-size: $font-md;
  text-align: center;
  &::after { border: none; }
}

.btn-disabled {
  opacity: 0.5;
  pointer-events: none;
}

// 标签
.tag {
  display: inline-block;
  padding: 2rpx 12rpx;
  font-size: $font-xs;
  border-radius: $radius-sm;
  &-brand { background: rgba($brand-primary, 0.1); color: $brand-primary; }
  &-success { background: rgba($success-color, 0.1); color: $success-color; }
  &-warning { background: rgba($warning-color, 0.1); color: $warning-color; }
  &-error { background: rgba($error-color, 0.1); color: $error-color; }
}

// 分割线
.divider {
  height: 1rpx;
  background: $border-color;
  margin: $spacing-md 0;
}

// 空状态
.empty-text {
  text-align: center;
  color: $text-placeholder;
  font-size: $font-md;
  padding: $spacing-xl 0;
}
</style>
