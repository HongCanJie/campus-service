const db=wx.cloud.database();
Page({

  data: {
    bookList:[]
  },

// 获取数据库数据
getData:function() {
  db.collection('books').get({
    success:res=>{
      // console.log(res);
      this.setData({
        bookList:res.data
      })
    }
  })
},

// 跳转页面
  showBookIntor:function (e) {
    // console.log(e);
    // 获取data中的id
    let id=e.currentTarget.dataset.id;
    console.log(id);
    // 跳转到图书详情页面
    wx.navigateTo({
      url: '../books_detail/books_detail?id='+id,
    })
  },

//下拉刷新事件
onPullDownRefresh(){
  // console.log("已经下拉");
  // 重置数组
  this.setData({
    bookList:[]
  })
  // 重新获取数据库数据
  this.getData();
},


  onLoad: function (options) {
    // 加载提示
    wx.showToast({
      title: '加载中...',
      icon:'loading',
      duration:1500
    })
    // 获取图书列表
    this.getData();
  }
})