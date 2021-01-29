// index.js
const util = require('../../utils/util.js')
let time = null
Page({
  data: {
    // 存储私钥列表
    codeList: [],
    // 存储倒计时
    time: 30 - parseInt(Date.now() % 30000 / 1000),
    // 保存编辑序列
    editIndex: 0,
    // 删除model控制变量
    showDelAccountModel: false
  },
  onLoad() {
    wx.showLoading({
      title: '加载中...',
    })
    // 从本地读取私钥列表
    this.setData({
      codeList: (wx.getStorageSync('codeList') || []).map(item => {
        item.code = util.generateGoogleCode(item.secret).replace(/(\d{3})(\d{3})/, "$1 $2")
        return item
      })
    })
    // 开启倒计时
    this.startTime()
    wx.hideLoading()
  },
  // 更新/存储私钥列表
  setStorage() {
    wx.setStorage({
      key: 'codeList',
      data: this.data.codeList.map(item => {
        delete item.code
        return item
      })
    })
  },
  // 倒计时开始
  startTime() {
    time = null
    const that = this
    // 定时器更新
    time = setInterval(_ => {
      that.setData({
        codeList: that.data.codeList.map(item => {
          item.code = util.generateGoogleCode(item.secret).replace(/(\d{3})(\d{3})/, "$1 $2")
          return item
        }),
        time: 30 - parseInt(Date.now() % 30000 / 1000)
      })
    }, 1000)
  },
  add() {
    // 添加私钥
    const that = this
    wx.scanCode({
      success (res) {
        const query = util.getQueryObjectByUrl(res.result)
        let codeList = that.data.codeList
        // 判断当前私钥是否存在
        if (util.arrayIsExistKeyValue(codeList, 'secret', query.secret)) {
          wx.showToast({
            title: '秘钥已保存',
            icon: 'none',
            duration: 2000
          })
          return
        }
        // 添加并保存本地
        codeList.push(query)
        that.setData({
          codeList: codeList
        })
        that.setStorage()
        // 重置定时器
        that.startTime()
      }
    })
  },
  // 长按编辑
  handleLongPress (e) {
    const index = e.currentTarget.dataset.value
    this.setData({
      editIndex: index
    })
    const that = this
    wx.showActionSheet({
      itemList: ['编辑', '删除'],
      success (res) {
        if (res.tapIndex === 0) {
          // 编辑
        }
        if (res.tapIndex === 1) {
          // 删除
          that.setData({
            showDelAccountModel: true
          })
        }
      }
    })
  },
  // 删除秘钥
  delAccount() {
    let codeList = this.data.codeList
    codeList.splice(this.data.editIndex, 1)
    this.setData({
      codeList: codeList
    })
    this.setStorage()
    this.startTime()
    this.clearDelAccountModel()
  },
  // 隐藏model
  clearDelAccountModel() {
    this.setData({
      showDelAccountModel: false
    })
  },
  // 页面卸载销毁定时器
  onUnLoad() {
    time = null
  }
})
