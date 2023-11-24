// 使用云数据库
const db=wx.cloud.database()
const news=db.collection('news')
Page({
  data:{
    article:[]
  },

  // 收藏功能
  addFavorites:function () {
    // 获取数据
    let article=this.data.article;
    // 存入缓存中
    wx.setStorageSync(article._id, article);
    // 选中
    this.setData({
      isAdd:true
    })
    wx.showToast({
      title: '已收藏',
      icon:"none"
    })
  },

  // 取消收藏功能
  cancelFavorites:function () {
    // 获取数据
    let article=this.data.article;
    // 从缓存中移除数据
    wx.removeStorageSync(article._id);
    wx.showToast({
      title: '取消收藏',
      icon:'none'
    })
    this.setData({
      isAdd:false
    })
  },

  // 加载初始数据
  onLoad: function (options) {
    // 显示提示框
    wx.showLoading({
      title: '数据加载中',
    })
    // 获取新闻编号
    let id=options.news_id;
    // 从缓存中获取数据
    let article=wx.getStorageSync(id);
    if(article!=""){
      // 更新页面信息
      this.setData({
        article:article,
        isAdd:true
      })
      // 隐藏加载数据提示框
      wx.hideLoading();
    }else{
      // 新闻不在缓存中也说明不在收藏夹中
      // 根据新闻ID在云数据库中查找新闻信息
      // console.log(id);
      news.doc(id).get({
        success:res=>{
          this.setData({
            article:res.data,
            isAdd:false
          })
          // 隐藏数据加载提示框
          wx.hideLoading();
        }
      })

    }

  },
})