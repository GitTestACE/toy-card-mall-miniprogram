// pages/order/order.js
const app = getApp()

Page({
  data: { orderList: [] },

  onShow() {
    const userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) { wx.redirectTo({ url: '/pages/login/login' }); return }
    app.globalData.userId = userInfo.id
    this.loadOrders()
  },

  loadOrders() {
    wx.request({
      url: `${app.globalData.baseUrl}/api/order/list?userId=${app.globalData.userId}`,
      success: (res) => { if (res.data.code === 200) { this.setData({ orderList: res.data.data }) } }
    })
  },

  onConfirmReceive(e) {
    const orderId = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认收货',
      content: '确定已收到商品吗？',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: `${app.globalData.baseUrl}/api/order/confirm`,
            method: 'POST',
            header: { 'Content-Type': 'application/json' },
            data: { orderId },
            success: (res) => {
              if (res.data.code === 200) {
                wx.showToast({ title: '确认成功', icon: 'success' })
                this.loadOrders()
              }
            }
          })
        }
      }
    })
  },

  goIndex() { wx.navigateTo({ url: '/pages/index/index' }) },
  goCart() { wx.navigateTo({ url: '/pages/cart/cart' }) }
})
