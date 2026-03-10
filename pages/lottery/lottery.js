// pages/lottery/lottery.js
const app = getApp();

Page({
  data: {
    // 活动信息
    activity: {
      id: 1,
      title: '幸运大抽奖',
      description: '积分越多，机会越多！'
    },
    // 用户信息
    userId: '',
    userPoints: 0,
    remainingTimes: 0,
    // 奖品列表
    prizeList: [],
    // 抽奖记录
    records: [],
    // 抽奖状态
    isDrawing: false,
    rotateAngle: 0,
    // 弹窗
    showResultModal: false,
    resultPrize: null
  },

  onLoad(options) {
    // 获取用户ID
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo && userInfo.id) {
      this.setData({ userId: userInfo.id });
      this.loadData();
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      setTimeout(() => {
        wx.redirectTo({ url: '/pages/login/login' });
      }, 1500);
    }
  },

  onShow() {
    // 每次显示页面时刷新数据
    this.loadData();
  },

  // 加载数据
  loadData() {
    this.loadActivity();
    this.loadRecords();
  },

  // 加载活动信息
  loadActivity() {
    const activityId = this.data.activity.id;
    
    wx.request({
      url: `${app.globalData.baseUrl}/api/lottery/activity/${activityId}`,
      method: 'GET',
      success: (res) => {
        if (res.data.code === 0) {
          const activity = res.data.data;
          // 计算每个奖品的位置角度
          const prizeList = activity.prizeList.map((item, index) => {
            const angle = (360 / activity.prizeList.length) * index - 90;
            return { ...item, angle };
          });
          
          this.setData({
            activity: {
              id: activity.id,
              title: activity.title,
              description: activity.description
            },
            prizeList: prizeList,
            remainingTimes: activity.remainingTimes || 0,
            userPoints: activity.userPoints || 0
          });
        } else {
          wx.showToast({
            title: res.data.msg || '获取活动失败',
            icon: 'none'
          });
        }
      },
      fail: () => {
        // 模拟数据，用于开发测试
        this.setMockData();
      }
    });
  },

  // 加载抽奖记录
  loadRecords() {
    const userId = this.data.userId;
    if (!userId) return;

    wx.request({
      url: `${app.globalData.baseUrl}/api/lottery/records`,
      method: 'GET',
      data: { userId },
      success: (res) => {
        if (res.data.code === 0) {
          this.setData({
            records: res.data.data || []
          });
        }
      },
      fail: () => {
        // 模拟数据
        this.setData({
          records: []
        });
      }
    });
  },

  // 设置模拟数据
  setMockData() {
    const prizeList = [
      { id: 1, name: '超级大奖', image: '/assets/prize/gift.png', points: 5000 },
      { id: 2, name: '100积分', image: '/assets/prize/points.png', points: 100 },
      { id: 3, name: '50积分', image: '/assets/prize/points.png', points: 50 },
      { id: 4, name: '20积分', image: '/assets/prize/points.png', points: 20 },
      { id: 5, name: '10积分', image: '/assets/prize/points.png', points: 10 },
      { id: 6, name: '5积分', image: '/assets/prize/points.png', points: 5 }
    ].map((item, index) => ({
      ...item,
      angle: (360 / 6) * index - 90
    }));

    this.setData({
      prizeList: prizeList,
      remainingTimes: 5,
      userPoints: 1000
    });
  },

  // 开始抽奖
  startDraw() {
    if (this.data.isDrawing) return;
    if (this.data.remainingTimes <= 0) {
      wx.showToast({
        title: '抽奖次数不足',
        icon: 'none'
      });
      return;
    }
    if (this.data.userPoints < 10) {
      wx.showToast({
        title: '积分不足',
        icon: 'none'
      });
      return;
    }

    this.setData({ isDrawing: true });

    // 发送抽奖请求
    wx.request({
      url: `${app.globalData.baseUrl}/api/lottery/draw`,
      method: 'POST',
      data: {
        userId: this.data.userId,
        activityId: this.data.activity.id
      },
      success: (res) => {
        if (res.data.code === 0) {
          const prize = res.data.data;
          this.animateAndShowResult(prize);
        } else {
          wx.showToast({
            title: res.data.msg || '抽奖失败',
            icon: 'none'
          });
          this.setData({ isDrawing: false });
        }
      },
      fail: () => {
        // 模拟抽奖结果
        const mockPrize = this.getMockPrize();
        this.animateAndShowResult(mockPrize);
      }
    });
  },

  // 模拟抽奖结果
  getMockPrize() {
    const prizeList = this.data.prizeList;
    const randomIndex = Math.floor(Math.random() * prizeList.length);
    return prizeList[randomIndex];
  },

  // 动画并显示结果
  animateAndShowResult(prize) {
    const prizeList = this.data.prizeList;
    const prizeIndex = prizeList.findIndex(p => p.id === prize.id);
    const anglePerPrize = 360 / prizeList.length;
    
    // 计算旋转角度（多转几圈）
    const targetAngle = 360 * 5 + (360 - prizeIndex * anglePerPrize - anglePerPrize / 2);
    const currentAngle = this.data.rotateAngle || 0;
    const rotateDiff = targetAngle - (currentAngle % 360);

    this.setData({
      rotateAngle: currentAngle + rotateDiff
    });

    // 动画完成后显示结果
    setTimeout(() => {
      this.setData({
        isDrawing: false,
        remainingTimes: this.data.remainingTimes - 1,
        userPoints: this.data.userPoints - 10,
        showResultModal: true,
        resultPrize: prize
      });

      // 刷新记录
      this.loadRecords();
    }, 3000);
  },

  // 关闭弹窗
  closeModal() {
    this.setData({
      showResultModal: false,
      resultPrize: null
    });
  },

  // 跳转首页
  goIndex() {
    wx.switchTab({ url: '/pages/index/index' });
  },

  // 跳转购物车
  goCart() {
    wx.switchTab({ url: '/pages/cart/cart' });
  },

  // 跳转个人中心
  goUser() {
    wx.switchTab({ url: '/pages/user/user' });
  }
});
