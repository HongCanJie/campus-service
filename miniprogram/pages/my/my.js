const db = wx.cloud.database()
Page({

  data: {
    fabu: false,
    login: false,
    biaobai: 0,
    xianzhi: 0,
    lost: 0,
    found: 0
  },


  onShow:function () {
    // 登录记录
    const login=wx.getStorageSync('login');
    // 登录用户信息
    const userInfo=wx.getStorageSync('userInfo');
    // 用户openid
    const openid=wx.getStorageSync('openid');
    if(login!=""){
      this.setData({
        login: true,
        userInfo:userInfo,
        openid:openid
      })
    }
    var temp = this.data.fabu
    var a = !temp
    this.setData({
      fabu: a
    })
    this.getBiaobai()
    this.getXianzhi()
    this.getLost()
  },

  
  getBiaobai: function() {
    var that = this
    db.collection('biaobai').where({
      _openid: this.data.openid
    }).count({
      success: function(res) {
        that.setData({
          biaobai: res.total
        })
      }
    })
  },
  getXianzhi: function() {
    var that = this
    db.collection('xianzhi').where({
      _openid: this.data.openid
    }).count({
      success: function(res) {
        that.setData({
          xianzhi: res.total
        })
      }
    })
  },
  getLost: function() {
    var that = this
    db.collection('found').where({
      _openid: this.data.openid
    }).count({
      success: function(res) {
        that.setData({
          found: res.total
        })
      }
    })
    db.collection('lost').where({
      _openid: this.data.openid
    }).count({
      success: function(res) {
        that.setData({
          lost: res.total
        })
      }
    })
  },

// 分享事件
  onShareAppMessage(event){
    return{
      title:'云约吧',
      imageUrl:'cloud://basic-2wp9o.6261-basic-2wp9o-1302282056/my-image.png',
      path:'../../pages/news_index/news_index'
    }
  }

})