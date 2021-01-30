// pages/add/add.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    issuer: '',
    issuerErrorMsg: '',
    secret: '',
    secretErrorMsg: ''
  },

  changeName(e) {
    let updateObj = {}
    updateObj[e.currentTarget.dataset.value] = e.detail.value
    this.setData(updateObj)
  },

  save() {
    if (this.data.issuer === '') return this.setData({ issuerErrorMsg: '请输入账号名' })
    if (this.data.secret === '') return this.setData({ secretErrorMsg: '请输入您的秘钥' })
    let codeList = JSON.parse(JSON.stringify(wx.getStorageSync('codeList') || []))
    // 判断私钥是否存在
    if (util.arrayIsExistKeyValue(codeList, 'secret', this.data.secret)) {
      wx.showToast({
        title: '秘钥已保存',
        icon: 'none',
        duration: 2000
      })
      return
    }
    codeList.push({
      issuer: this.data.issuer,
      secret: this.data.secret
    })
    wx.setStorage({
      key: 'codeList',
      data: codeList
    })
    wx.navigateBack()
  }
})