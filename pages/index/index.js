// pages/index/index.js
const app = getApp()

Page({
  data: {
    currentType: '',
    goodsList: [],
    hotGoods: []
  },

  onLoad() {
    this.loadGoods()
    this.loadHotGoods()
  },

  onShow() {
    const userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.redirectTo({ url: '/pages/login/login' })
      return
    }
    app.globalData.userId = userInfo.id
  },

  loadHotGoods() {
    wx.request({
      url: `${app.globalData.baseUrl}/api/goods/hot`,
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({ hotGoods: res.data.data })
        }
      }
    })
  },

  onSwitchType(e) {
    const type = e.currentTarget.dataset.type
    this.setData({ currentType: type })
    this.loadGoods()
  },

  loadGoods() {
    const type = this.data.currentType
    let url = `${app.globalData.baseUrl}/api/goods`
    if (type) url += `?type=${type}`

    wx.request({
      url,
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({ goodsList: res.data.data })
        }
      }
    })
  },

  onAddCart(e) {
    const goodsId = e.currentTarget.dataset.id
    const userId = app.globalData.userId

    wx.request({
      url: `${app.globalData.baseUrl}/api/cart/add`,
      method: 'POST',
      header: { 'Content-Type': 'application/json' },
      data: { userId, goodsId, num: 1 },
      success: (res) => {
        if (res.data.code === 200) {
          wx.showToast({ title: '已加入购物车', icon: 'success' })
        }
      }
    })
  },

  goCart() { wx.navigateTo({ url: '/pages/cart/cart' }) },
  goUser() { wx.navigateTo({ url: '/pages/user/user' }) }
})
