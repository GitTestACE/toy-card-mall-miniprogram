// pages/signin/signin.js
const app = getApp();

Page({
  data: {
    signedToday: false,
    continuousDays: 0,
    makeUpCount: 0,
    currentPoints: 0,
    signedDates: [],
    nextBonus: null,
    loading: false,
    rewardConfig: [
      { days: 5, points: 10 },
      { days: 10, points: 100 },
      { days: 20, points: 300 }
    ]
  },

  onLoad() {
    this.fetchStatus();
  },

  onShow() {
    this.fetchStatus();
  },

  // 获取签到状态
  fetchStatus() {
    this.setData({ loading: true });
    wx.request({
      url: `${app.globalData.apiBase}/api/sign-in/status`,
      method: 'GET',
      header: {
        'Authorization': `Bearer ${app.globalData.token}`,
        'X-User-Id': app.globalData.userId
      },
      success: (res) => {
        if (res.data.code === 0) {
          const data = res.data.data;
          this.setData({
            signedToday: data.signedToday,
            continuousDays: data.continuousDays,
            makeUpCount: data.makeUpAllowance,
            currentPoints: data.currentPoints,
            signedDates: data.signedDates || [],
            nextBonus: data.nextBonus
          });
        }
      },
      complete: () => {
        this.setData({ loading: false });
      }
    });
  },

  // 签到
  handleSignIn() {
    if (this.data.signedToday) {
      wx.showToast({ title: '今日已签到', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '签到中...' });
    wx.request({
      url: `${app.globalData.apiBase}/api/sign-in`,
      method: 'POST',
      header: {
        'Authorization': `Bearer ${app.globalData.token}`,
        'X-User-Id': app.globalData.userId
      },
      success: (res) => {
        if (res.data.code === 0) {
          const data = res.data.data;
          wx.showModal({
            title: '签到成功',
            content: `获得 ${data.pointsEarned} 积分${data.bonusPoints > 0 ? '，连续签到奖励 ' + data.bonusPoints + ' 积分' : ''}`,
            showCancel: false
          });
          this.fetchStatus();
        } else {
          wx.showToast({ title: res.data.message || '签到失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.showToast({ title: '网络错误', icon: 'none' });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },

  // 补签
  handleMakeUp(e) {
    const date = e.detail.date;
    
    if (this.data.makeUpCount <= 0) {
      wx.showToast({ title: '本月补签次数已用完', icon: 'none' });
      return;
    }

    const cost = this.data.makeUpCount === 1 ? 50 : 100;
    
    wx.showModal({
      title: '确认补签',
      content: `补签 ${date}，消耗 ${cost} 积分`,
      success: (res) => {
        if (res.confirm) {
          this.doMakeUp(date);
        }
      }
    });
  },

  doMakeUp(date) {
    wx.showLoading({ title: '补签中...' });
    wx.request({
      url: `${app.globalData.apiBase}/api/sign-in/make-up`,
      method: 'POST',
      header: {
        'Authorization': `Bearer ${app.globalData.token}`,
        'X-User-Id': app.globalData.userId
      },
      data: { date },
      success: (res) => {
        if (res.data.code === 0) {
          const data = res.data.data;
          wx.showToast({ title: '补签成功', icon: 'success' });
          this.fetchStatus();
        } else {
          wx.showToast({ title: res.data.message || '补签失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.showToast({ title: '网络错误', icon: 'none' });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  }
});
