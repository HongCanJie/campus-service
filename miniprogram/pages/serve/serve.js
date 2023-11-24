Page({

  data: {

  },
  
  // 跳转到表白墙
  biaobai: function() {
    wx.navigateTo({
      url: '../biaobai/biaobai',
    })
  },

  // 跳转到失物招领
  lost: function() {
    wx.navigateTo({
      url: '../lost/lost',
    })
  },

// 跳转到电子图书
  book: function() {
    wx.navigateTo({
      url: '../books/books',
    })
  },

  // 跳转到闲置买卖
  xianzhi: function() {
    wx.navigateTo({
      url: '../xianzhi/xianzhi',
    })
  },

  // 跳转到新闻消息
xinwen:function () {
  wx.switchTab({
    url: '../news_index/news_index',
  })
},

// 跳转到计算器
calculator:function () {
  wx.navigateTo({
    url: '../calculator/calculator', 
  })
}

})