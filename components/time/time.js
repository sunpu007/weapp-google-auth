// component/time/time.js
Component({
  ready() {
    const query = wx.createSelectorQuery()
    console.log(query)
    query.select('#myCanvas')
    .fields({ node: true, size: true })
    .exec((res) => {
      console.log('=====>', res)
      const canvas = res[0].node
      const ctx = canvas.getContext('2d')

      const dpr = wx.getSystemInfoSync().pixelRatio
      canvas.width = res[0].width * dpr
      canvas.height = res[0].height * dpr
      ctx.scale(dpr, dpr)

      ctx.fillRect(0, 0, 100, 100)
    })
  },

  detached () {
    console.log(22222)
  },

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
