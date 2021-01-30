// components/com-input/com-input.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    label: {
      type: String,
      value: ''
    },
    value: {
      type: String,
      value: ''
    },
    errorMsg: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isFocus: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onfocus() {
      this.setData({
        isFocus: true
      })
    },
    onblur() {
      this.setData({
        isFocus: false
      })
    },
    inputChange(e) {
      if (e.detail.value !== '') {
        this.setData({
          errorMsg: ''
        })
      }
      this.setData({
        value: e.detail.value
      })
      this.triggerEvent('changeName', {
        value: e.detail.value
      })
    }
  }
})
