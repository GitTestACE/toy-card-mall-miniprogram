// pages/cart/cart.js
const app = getApp()

Page({
  data: {
    cartList: [],
    totalPrice: 0
  },

  onShow() {
    const userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.redirectTo({ url: '/pages/login/login' })
      return
    }
    app.globalData.userId = userInfo.id
    this.loadCart()
  },

  loadCart() {
    wx.request({
      url: `${app.globalData.baseUrl}/api/cart/list?userId=${app.globalData.userId}`,
      success: (res) => {
        if (res.data.code === 200) {
          const cartList = res.data.data
          const totalPrice = cartList.reduce((sum, item) => sum + item.price * item.num, 0)
          this.setData({ cartList, totalPrice })
        }
      }
    })
  },

  onDecrease(e) {
    const cartId = e.currentTarget.dataset.id
    const num = e.currentTarget.dataset.num
    if (num <= 1) { this.onDelete(e); return }
    this.updateNum(cartId, num - 1)
  },

  onIncrease(e) {
    const cartId = e.currentTarget.dataset.id
    const num = e.currentTarget.dataset.num
    this.updateNum(cartId, num + 1)
  },

  updateNum(cartId, num) {
    wx.request({
      url: `${app.globalData.baseUrl}/api/cart/update`,
      method: 'POST',
      header: { 'Content-Type': 'application/json' },
      data: { cartId, num },
      success: () => { this.loadCart() }
    })
  },

  onDelete(e) {
    const cartId = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认删除',
      content: '确定要从购物车移除该商品吗？',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: `${app.globalData.baseUrl}/api/cart/delete`,
            method: 'POST',
            header: { 'Content-Type': 'application/json' },
            data: { cartId },
            success: () => {
              wx.showToast({ title: '已删除', icon: 'success' })
              this.loadCart()
            }
          })
        }
      }
    })
  },

  onCheckout() {
    const cartList = this.data.cartList
    if (cartList.length === 0) return

    const cartIds = cartList.map(item => item.id)
    const totalPrice = this.data.totalPrice
    const userId = app.globalData.userId

    wx.showModal({
      title: '确认支付',
      content: `将消耗 ${totalPrice} 积分`,
      confirmText: '确认支付',
      success: (modalRes) => {
        if (modalRes.confirm) {
          wx.showLoading({ title: '下单中...' })
          wx.request({
            url: `${app.globalData.baseUrl}/api/order/create`,
            method: 'POST',
            header: { 'Content-Type': 'application/json' },
            data: { userId, cartIds },
            success: (res) => {
              wx.hideLoading()
              if (res.data.code === 200) {
                wx.showToast({ title: '下单成功！', icon: 'success' })
                this.loadCart()
              } else {
                wx.showToast({ title: res.data.msg || '下单失败', icon: 'none' })
              }
            }
          })
        }
      }
    })
  },

  goIndex() { wx.navigateBack() },
  goUser() { wx.navigateTo({ url: '/pages/user/user' }) }
})
