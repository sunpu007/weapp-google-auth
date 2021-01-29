// index.js
// 获取应用实例
// const app = getApp()
const util = require('../../utils/util.js')
let time = null
Page({
  data: {
    codeList: [],
    time: parseInt(Date.now() % 30000 / 1000)
  },
  onLoad() {
    this.setData({
      codeList: (wx.getStorageSync('codeList') || []).map(item => {
        item.code = util.generateGoogleCode(item.secretKey).replace(/(\d{3})(\d{3})/, "$1 $2")
        return item
      })
    })
    this.setTime()
  },
  setStorage() {
    wx.setStorage({
      key: 'codeList',
      data: this.data.codeList.map(item => {
        delete item.code
        return item
      })
    })
  },
  setTime() {
    const that = this
    // 定时器更新
    time = setInterval(_ => {
      that.setData({
        codeList: that.data.codeList.map(item => {
          item.code = util.generateGoogleCode(item.secretKey).replace(/(\d{3})(\d{3})/, "$1 $2")
          return item
        }),
        time: parseInt(Date.now() % 30000 / 1000)
      })
      // console.log(parseInt(Date.now() % 30000 / 1000) / 30)
    }, 1000)
  },
  add() {
    wx.scanCode({
      success (res) {
        console.log(res.result)
      }
    })
  },
  onUnLoad() {
    time = null
  }
})
