const db = wx.cloud.database()
Page({
  data: {
    imgbox: []
  },

  onLoad: function(options) {
    var that = this
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        that.setData({
          openid: res.data
        })
      },
    })
    db.collection('xianzhi')
      .orderBy('createTime', 'desc') //按发布视频排序
      .get({
        success(res) {
          console.log("请求成功", res.data[0])
          that.setData({
            dataList: res.data
          })
        },
        fail(res) {
          console.log("请求失败", res)
        }
      })
  },
  delete: function(e) {
    var info = e.currentTarget.dataset.t
    console.log(info)
    db.collection('xianzhi').doc(info._id).remove({
      success: function(res) {
        console.log(res.data)
        wx.showToast({
          icon: 'none',
          title: '删除成功',
        })
      }
    })
    this.onLoad()
  },
  send: function() {
    wx.getStorage({
      key: 'login',
      success: function (res) {
        if (res.data) {
          wx.navigateTo({
            url: '../send/send?name=xianzhi',
          })
        } else {
          wx.showToast({
            icon: "none",
            title: '你还未登录'
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          icon: "none",
          title: '你还未登录'
        })
      }
    })
  },
  go: function(event) {
    var info = event.currentTarget.dataset.id
    wx.setStorage({
      key: 'info',
      data: info,
    })
    wx.navigateTo({
      url: '../temp/temp?name=xianzhi',
    })
  },

  onShow: function() {
    this.onLoad()
  }
  
})