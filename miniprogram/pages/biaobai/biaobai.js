const db = wx.cloud.database()
// 获取系统当前的时间
var util = require('../../util/util');

Page({

  data: {
    isSend: false
  },

  onLoad: function (options) {
    // 获取data中的变量值
    var that = this
    // 获取用户登录的id
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          openid: res.data
        }) 
      },
    })
    //获取云数据库中的数据，按发布时间排序
    db.collection('biaobai').orderBy('createTime', 'desc').get({
        success(res) {
          // console.log(res);
          // console.log("请求成功", res.data[0].info)
          that.setData({
            dataList: res.data
          })
          // console.log(that.data.dataList[0])
        },
        fail(res) {
          console.log("请求失败", res)
        }
      })
  },

  //获取输入内容赋值到data中
  getInput1(event) {
    // console.log("输入的对象", event.detail.value)
    this.setData({
      to: event.detail.value
    })
  },
  getInput2(event) {
    // console.log("输入的称呼", event.detail.value)
    this.setData({
      writer: event.detail.value
    })
  },
  getInput3(event) {
    // console.log("输入的内容", event.detail.value)
    this.setData({
      info: event.detail.value
    })
  },


  //打开发送的弹窗
  send: function () {
    // 获取data中的变量值
    var that = this
    // 获取缓存中的用户id
    wx.getStorage({
      key: 'login',
      success: function (res) {
        // 判断是否有发送的权限
        if (res.data) {
          that.setData({
            isSend: true
          })
        } else {
          wx.showToast({
            icon: "none",
            title: '请先登录'
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          icon: "none",
          title: '请先登录'
        })
      }
    })
  },
  // 关闭弹窗按钮
  close: function () {
    this.setData({
      isSend: false
    })
  },


  //上传数据按钮
  publish: function () {
    // 从data中获取数据并存到云数据库
    let writer = this.data.writer
    let to = this.data.to
    let info = this.data.info
    var likeNumber = 1
    console.log(likeNumber)
    // 判断对象框的值是否为空
    if (!to) {
      wx.showToast({
        icon: "none",
        title: '对象不能为空'
      })
      return
    }
    // 判断发表人是否为空
    if (!writer) {
      wx.showToast({
        icon: "none",
        title: '称呼不能为空'
      })
      return
    }
    // 判断内容是否为空且格式不少于三个字
    if (!info || info.length < 3) {
      wx.showToast({
        icon: "none",
        title: '内容要多于三个字'
      })
      return
    }
    wx.showLoading({
      title: '即将发布...',
    })
    // 调用云函数上传数据
    wx.cloud.callFunction({
      name: 'love',
      data: {
        info: this.data.info,
        to: this.data.to,
        writer: this.data.writer,
        sendTime: util.formatTime(new Date())
      },
      success: res => {
        wx.hideLoading()
        wx.showToast({
          title: '发布成功！',
        })
        console.log('发布成功！', res)
        // 取消发布的权限
        this.setData({
          isSend: false
        })
        // 重新判断发布的权限
        this.onLoad()
        // 初始化data中的数据
        this.setData({
          to: null,
          writer: null,
          info: null
        })
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '请稍候...'
        })
        console.error('发布失败', err)
      }
    })
  },

// 删除发布的表白栏框
  delete: function (e) {
    // 获取将要删除的栏框的所有信息
    var info = e.currentTarget.dataset.t;
    // console.log(info);
    // 根据栏框的id删除数据库中相应的数据
    db.collection('biaobai').doc(info._id).remove({
      success: function (res) {
        // console.log(res.data)
        wx.showToast({
          icon: 'none',
          title: '删除成功！',
        })
      }
    })
    // 重新加载
    this.onLoad()
  }

 
})