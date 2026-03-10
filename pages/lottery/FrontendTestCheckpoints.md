# 抽奖功能前端测试检查点

## 测试环境
- 微信开发者工具 / 真机调试
- 后端服务运行在 `http://localhost:8080`

---

## 1. 页面加载测试

### 1.1 抽奖页面正常加载
**检查点**:
- [ ] 页面能够正常打开，无白屏/报错
- [ ] 页面标题显示正确（如"抽奖活动"）
- [ ] 活动信息区域正常显示
- [ ] 奖品列表正常渲染

### 1.2 未登录跳转
**前置条件**: 本地存储无userInfo

**检查点**:
- [ ] 页面自动跳转到登录页
- [ ] 跳转后能正常登录并返回

---

## 2. 活动信息展示测试

### 2.1 活动详情展示
**调用API**: `GET /api/lottery/activity/{id}`

**检查点**:
- [ ] 活动名称正确显示
- [ ] 抽奖消耗积分显示正确（costPoints）
- [ ] 每日抽奖次数限制显示正确（dailyLimit）
- [ ] 活动状态（进行中/未开启/已结束）显示正确
- [ ] 活动时间范围显示正确

### 2.2 活动未开启状态
**前置条件**: 活动status = 0

**检查点**:
- [ ] 显示"活动未开启"提示
- [ ] 抽奖按钮置灰/不可点击
- [ ] 显示开始时间倒计时（如有）

### 2.3 活动已结束状态
**前置条件**: 当前时间 > endTime

**检查点**:
- [ ] 显示"活动已结束"提示
- [ ] 抽奖按钮置灰/不可点击

---

## 3. 奖品列表展示测试

**调用API**: `GET /api/lottery/activity/{id}`

**检查点**:
- [ ] 所有奖品正确渲染
- [ ] 奖品名称显示正确
- [ ] 奖品图片正确显示（如有）
- [ ] 奖品概率/库存显示（如设计需要）
- [ ] "谢谢参与"项正确显示

---

## 4. 抽奖功能测试

### 4.1 正常抽奖
**前置条件**: 
- 用户已登录
- 积分充足
- 抽奖次数未用完
- 活动进行中

**操作流程**:
1. 点击"立即抽奖"按钮
2. 等待抽奖结果动画/加载
3. 查看结果展示

**检查点**:
- [ ] 点击后显示加载状态
- [ ] 抽奖结果正确展示
- [ ] 抽中奖品显示正确（名称、类型、值）
- [ ] 剩余积分实时更新
- [ ] 剩余抽奖次数实时更新
- [ ] 抽奖记录正确保存

### 4.2 积分不足提示
**前置条件**: 用户积分 < 活动costPoints

**检查点**:
- [ ] 点击抽奖按钮后弹出提示"积分不足"
- [ ] 提示引导用户获取积分（如充值）
- [ ] 不发送抽奖请求或服务端返回错误

### 4.3 抽奖次数用完提示
**前置条件**: 今日抽奖次数已达上限

**检查点**:
- [ ] 抽奖按钮置灰或不可点击
- [ ] 显示"今日次数已用完"提示
- [ ] 显示明日重置时间

### 4.4 活动未开启/已结束
**检查点**:
- [ ] 抽奖按钮不可点击
- [ ] 显示相应状态提示

---

## 5. 抽奖结果展示测试

### 5.1 中奖结果展示
**检查点**:
- [ ] 弹窗/区域正确显示奖品信息
- [ ] 奖品名称清晰可见
- [ ] 积分奖品显示"积分已发放到账户"
- [ ] 实物奖品显示领取指引
- [ ] 优惠券显示使用方式

### 5.2 未中奖展示
**前置条件**: 抽中"谢谢参与"

**检查点**:
- [ ] 显示"谢谢参与"提示
- [ ] 样式与其他奖品区分（如灰色）

### 5.3 奖品库存不足
**检查点**:
- [ ] 显示"奖品已发完"
- [ ] 自动视为未中奖

---

## 6. 抽奖记录测试

### 6.1 查看历史记录
**调用API**: `GET /api/lottery/records?userId={userId}`

**检查点**:
- [ ] 记录列表正常加载
- [ ] 显示历史抽奖记录
- [ ] 每条记录包含：时间、奖品名称、状态
- [ ] 按时间倒序排列

### 6.2 记录为空
**前置条件**: 用户无抽奖记录

**检查点**:
- [ ] 显示"暂无抽奖记录"
- [ ] 引导用户参与抽奖

---

## 7. 用户信息展示测试

### 7.1 用户积分显示
**检查点**:
- [ ] 当前积分正确显示
- [ ] 抽奖后积分实时更新

### 7.2 剩余抽奖次数显示
**检查点**:
- [ ] 今日剩余次数正确显示
- [ ] 抽奖后次数实时更新

---

## 8. 异常情况测试

### 8.1 网络错误
**操作**: 断开网络后点击抽奖

**检查点**:
- [ ] 显示网络错误提示
- [ ] 有重试按钮或引导刷新

### 8.2 接口返回错误
**场景**: 服务端返回非200状态码

**检查点**:
- [ ] 正确显示后端返回的错误信息
- [ ] 无闪退或白屏

### 8.3 并发请求防护
**操作**: 快速连续点击抽奖按钮多次

**检查点**:
- [ ] 只执行一次抽奖
- [ ] 按钮在请求期间禁用
- [ ] 返回结果后恢复

---

## 9. UI/UX 测试

### 9.1 动画效果
**检查点**:
- [ ] 抽奖过程有加载/动画效果
- [ ] 结果展示有过渡动画
- [ ] 动画流畅无卡顿

### 9.2 响应式布局
**检查点**:
- [ ] 不同屏幕尺寸显示正常
- [ ] 奖品列表自适应排列

### 9.3 交互反馈
**检查点**:
- [ ] 按钮点击有触感反馈
- [ ] 操作后有Toast提示

---

## 10. 测试用例表

| 序号 | 测试场景 | 预期结果 | 检查点 |
|------|----------|----------|--------|
| 1 | 正常抽奖 | 抽奖成功并展示结果 | 积分扣除、次数扣减、记录保存 |
| 2 | 积分不足抽奖 | 提示积分不足 | 提示文案正确、不发请求 |
| 3 | 次数用完抽奖 | 提示次数用完 | 按钮禁用、提示正确 |
| 4 | 活动未开启抽奖 | 提示活动未开启 | 按钮禁用 |
| 5 | 活动已结束抽奖 | 提示活动已结束 | 按钮禁用 |
| 6 | 查看抽奖记录 | 显示历史记录 | 列表完整、时间正确 |
| 7 | 网络异常抽奖 | 显示网络错误 | 有错误提示和重试选项 |
| 8 | 并发抽奖防护 | 只执行一次 | 按钮正确禁用 |
| 9 | 查看活动详情 | 活动信息完整 | 字段显示正确 |
| 10 | 奖品库存不足 | 显示谢谢参与 | 处理正确 |

---

## 11. 前端代码实现建议

```javascript
// pages/lottery/lottery.js
const app = getApp()

Page({
  data: {
    activity: null,
    prizes: [],
    userPoints: 0,
    remainingTimes: 0,
    isDrawing: false,
    result: null
  },

  onLoad(options) {
    const activityId = options.activityId || 1
    this.loadActivity(activityId)
  },

  loadActivity(activityId) {
    wx.request({
      url: `${app.globalData.baseUrl}/api/lottery/activity/${activityId}`,
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({
            activity: res.data.data.activity,
            prizes: res.data.data.prizes,
            userPoints: app.globalData.userInfo.points,
            remainingTimes: res.data.data.activity.dailyLimit
          })
        }
      }
    })
  },

  onDraw() {
    if (this.data.isDrawing) return
    if (this.data.remainingTimes <= 0) {
      wx.showToast({ title: '今日次数已用完', icon: 'none' })
      return
    }
    if (this.data.userPoints < this.data.activity.costPoints) {
      wx.showToast({ title: '积分不足', icon: 'none' })
      return
    }

    this.setData({ isDrawing: true })

    wx.request({
      url: `${app.globalData.baseUrl}/api/lottery/draw`,
      method: 'POST',
      header: { 'Content-Type': 'application/json' },
      data: {
        userId: app.globalData.userId,
        activityId: this.data.activity.id
      },
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({
            result: res.data.data,
            userPoints: res.data.data.remainingPoints,
            remainingTimes: res.data.data.remainingTimes
          })
          // 显示结果弹窗
        } else {
          wx.showToast({ title: res.data.msg, icon: 'none' })
        }
      },
      complete: () => {
        this.setData({ isDrawing: false })
      }
    })
  },

  loadRecords() {
    wx.request({
      url: `${app.globalData.baseUrl}/api/lottery/records`,
      data: { userId: app.globalData.userId },
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({ records: res.data.data })
        }
      }
    })
  }
})
```
