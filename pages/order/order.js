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
      success: (res) => { 
        if (res.data.code === 200) { 
          // 计算每个订单是否可确认收货
          const orders = res.data.data.map(order => {
            const allShipped = order.items.every(item => (item.shippedNum || 0) >= item.num)
            order.canConfirm = allShipped && order.status === 'pending'
            return order
          })
          this.setData({ orderList: orders }) 
        } 
      }
    })
  },

  onConfirmReceive(e) {
    const orderId = e.currentTarget.dataset.id
    const order = this.data.orderList.find(o => o.id === orderId)
    
    // 检查是否全部发货
    if (order && !order.canConfirm) {
      wx.showModal({
        title: '提示',
        content: '订单还未全部发货，无法确认收货',
        showCancel: false
      })
      return
    }
    
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
              } else {
                wx.showToast({ title: res.data.message || '操作失败', icon: 'none' })
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
