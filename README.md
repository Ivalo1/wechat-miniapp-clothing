# wechat-miniapp-clothing

这是一个用于开发“服装类”微信小程序的仓库骨架。

技术选型：
- 框架：uni-app（便于跨端，推荐用于微信小程序）
- UI：可以后续选择 uView 或自定义组件库

仓库结构说明：
- src/ - 源代码目录（页面、组件、静态资源）
- src/pages/index - 首页示例（商品列表）
- src/components - 可复用组件
- src/utils - 演示用的假数据

快速开始（在本地）：
1. 安装依赖：
   npm install

2. 使用 HBuilderX 或 uni-app CLI 运行到微信小程序：
   npm run dev:mp-weixin

下一步建议：
- 如果你同意，我可以：
  - 添加 uView 或其它 UI 库（可选）
  - 增加商品详情页、购物车、下单流程的页面模板
  - 配置 CI/CD（例如自动构建到微信开发者工具或构建产物）

如需换成 Taro 或原生小程序，请告诉我。
