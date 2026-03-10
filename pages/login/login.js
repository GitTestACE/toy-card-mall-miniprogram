// pages/login/login.js
const app = getApp()

Page({
  data: {
    nickname: '',
    selectedAvatar: 0,
    avatars: [
      'https://placehold.co/100x100/ff6b6b/white?text=😀',
      'https://placehold.co/100x100/4ecdc4/white?text=😎',
      'https://placehold.co/100x100/ffe66d/333?text=🤩',
      'https://placehold.co/100x100/95e1d3/333?text=😊',
      'https://placehold.co/100x100/dda0dd/white?text=😇',
      'https://placehold.co/100x100/87ceeb/white?text=🤗'
    ]
  },

  onNicknameInput(e) {
    this.setData({ nickname: e.detail.value })
  },

  onSelectAvatar(e) {
    this.setData({ selectedAvatar: e.currentTarget.dataset.index })
  },

  onLogin() {
    const nickname = this.data.nickname.trim()
    if (!nickname) {
      wx.showToast({ title: '请输入昵称', icon: 'none' })
      return
    }

    const avatar = this.data.avatars[this.data.selectedAvatar]
    
    wx.showLoading({ title: '登录中...' })
    
    wx.request({
      url: `${app.globalData.baseUrl}/api/login`,
      method: 'POST',
      header: { 'Content-Type': 'application/json' },
      data: { nickname, avatar },
      success: (res) => {
        wx.hideLoading()
        if (res.data.code === 200) {
          wx.setStorageSync('userInfo', res.data.data)
          app.globalData.userId = res.data.data.id
          wx.showToast({ title: res.data.msg, icon: 'success' })
          setTimeout(() => {
            wx.navigateTo({ url: '/pages/index/index' })
          }, 1000)
        } else {
          wx.showToast({ title: res.data.msg || '登录失败', icon: 'none' })
        }
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({ title: '网络错误，请检查后端是否启动', icon: 'none' })
      }
    })
  }
})
