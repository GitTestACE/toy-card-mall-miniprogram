// pages/user/user.js
const app = getApp()

Page({
  data: {
    userInfo: {},
    defaultAvatar: 'https://placehold.co/100x100/ff6b6b/white?text=用户'
  },

  onShow() {
    const userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) { wx.redirectTo({ url: '/pages/login/login' }); return }
    this.setData({ userInfo })
    app.globalData.userId = userInfo.id
  },

  goOrder() { wx.navigateTo({ url: '/pages/order/order' }) },

  onRefreshPoints() {
    wx.request({
      url: `${app.globalData.baseUrl}/api/user/info?userId=${app.globalData.userId}`,
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({ userInfo: res.data.data })
          wx.setStorageSync('userInfo', res.data.data)
          wx.showToast({ title: '积分已刷新', icon: 'success' })
        }
      }
    })
  },

  goIndex() { wx.navigateTo({ url: '/pages/index/index' }) },
  goCart() { wx.navigateTo({ url: '/pages/cart/cart' }) },

  onLogout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync()
          wx.redirectTo({ url: '/pages/login/login' })
        }
      }
    })
  }
})
