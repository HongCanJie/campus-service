// 使用云数据库
// const db=wx.cloud.database()
// const news=db.collection('news')
    // 每次读取的新闻数量
  //  var row=10
   // 当前是第几页
  //  var page=0
Page({ 

  data: {
 // 新闻消息数组
 newsList:[],
  },


// 获取数据函数
getData(nums=10,page=0){
  wx.cloud.callFunction({
    name:"newsGetList",
    data:{
      // 每次读取条目数
      nums:nums,
      // 当前页数
      page:page      
    }
  }).then(res=>{
    var oldData=this.data.newsList
    var newData=oldData.concat(res.result.data)
    this.setData({
      newsList:newData
    })
    //数据请求完毕之后，及时关闭下拉刷新提示
    wx.stopPullDownRefresh();
    // console.log(res);
  })
},


  onLoad: function (options) {
    // news.limit(row).get({
    //   success:res=>{
    //     this.setData({
    //       newsList:res.data
    //     }) 
    //   }
    // })
    wx.showToast({
      title: '加载中',
      icon:'loading',
      duration:1000
    })
    this.getData();
  },

// 触底刷新事件
  onReachBottom(){
    // console.log("触底");
    // 显示加载中页面
    wx.showToast({
      title: '加载中',
      icon:'loading',
      duration:500
    })
    var page=this.data.newsList.length;
      this.getData(10,page);
    },

    //下拉刷新事件
  onPullDownRefresh(){
    // console.log("已经下拉");
    // 重置数组
    this.setData({
      newsList:[]
    })
    // 重置页码
    var page=0;
    // 重新发送请求 
    this.getData(10,page);
  }
})