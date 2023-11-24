const util=require("../../util/util")
Page({

  data: {

  },

// 跳转到发布页面
  toPublish:function () {
    const userInfo=wx.getStorageSync('userInfo');
    // console.log(userInfo);
    if(userInfo){
      wx.navigateTo({
        url: '../share_publish/share_publish',
      })
    }else{
      wx.showToast({
        icon: "none",
        title: '请先登录'
      })
    }

  },

// 跳转到博客详情页面
toDetail(event){
  // console.log(event.currentTarget.dataset.id);
wx.navigateTo({
  url: '../../pages/share_detail/share_detail?id='+event.currentTarget.dataset.id,
})
},

  // 获取数据
  getActionsList:function () {
    const openid=wx.getStorageSync('openid');
    var that=this;
    wx.cloud.database().collection('actions').orderBy('time','desc').get({
      success(res){
        // console.log(res);
        // 时间格式化
    var list=res.data;
    for(var l in list){
          list[l].time=util.formatTime(new Date(list[l].time))
    }
    // 点赞返回值
    for(var l in list){
      for(var j in list[l].prizeList){
        if(list[l].prizeList[j].openid ==openid ){
          list[l].isPrized = true
        }
      }
    }

    that.setData({
      actionsList:list
    })
      }
    })
  },

// 显示页面时就刷新
 onShow:function(options){
  this.getActionsList();
 },

  onLoad: function (options) {
    // 获取缓存中的openid
    const myOpenid=wx.getStorageSync('openid');
    this.setData({
      myOpenid:myOpenid
    })
    this.getActionsList();
  },

  // 下拉刷新
  onPullDownRefresh(){
    // 置空
    this.setData({
      actionsList:[]
    })
    // 重新获取数据
    this.getActionsList();
    // 延迟关闭下来刷新
    setTimeout(function () {
      wx.stopPullDownRefresh();
    },1000)
  },

  // 删除事件
  deleteAction(event){
    // console.log(event.currentTarget.dataset.id);
    var that=this;
    wx.cloud.database().collection('actions').doc(event.currentTarget.dataset.id).remove({
      success(res){
        // console.log(res);
        wx.showToast({
          title: '删除成功！',
          icon:'none'
        })
        that.getActionsList();
      }
    })
  },

  // 点赞事件
  prizeAction(event){
    // 获取缓存中的用户信息
    const userInfo=wx.getStorageSync('userInfo');
    const openid=wx.getStorageSync('openid');
    // 判断是否授权
    if(userInfo == null){
      wx.showToast({
        icon: "none",
        title: '请先登录'
      })
    }else {
      // console.log(event.currentTarget.dataset.id)
      var that = this;
      // 获取数据库中的值
      wx.cloud.database().collection('actions').doc(event.currentTarget.dataset.id).get({
        success(res){

          // console.log(res)
          var action = res.data
          var tag = false
          var index 
          // 遍历数组判断是否点赞过
          for(var l in action.prizeList){
            if(action.prizeList[l].openid == openid){
              tag = true
              // 点赞的索引
              index = l
              break
            }
          }
          // 判断之前是否点过赞
          if(tag){
            //之前点赞过 删除点赞记录
            // 删除数据中的该用户点赞记录
            action.prizeList.splice(index,1)
            // console.log(action)
            // 更新数据库
            wx.cloud.database().collection('actions').doc(event.currentTarget.dataset.id).update({
              data: {
                prizeList: action.prizeList
              },
              success(res){

                // console.log(res)
                that.getActionsList()

              }
            })
          }else{
            //之前未点赞  添加点赞记录
            var user = {}
            user.nickName = userInfo.nickName
            user.faceImg = userInfo.avatarUrl
            user.openid = openid
          // 点赞后将用户信息插入数值中
            action.prizeList.push(user)

            // console.log(action.prizeList)
          // 点赞后更新数据库
            wx.cloud.database().collection('actions').doc(event.currentTarget.dataset.id).update({
              data: {
                prizeList: action.prizeList
              },
              success(res){
                // console.log(res)
                // 提示
                wx.showToast({
                  title: '点赞成功！',
                  icon:'none'
                })
                 // 刷新数据
                that.getActionsList()
              }
            })
          }

        }
      })

    }

  },







  // 长按删除评论
  deleteComment(event){
    var that = this;
    // console.log(event.currentTarget.dataset.id);
    // console.log(event.currentTarget.dataset.index);
    wx.showModal({
      title:'提示',
      content:'确定要删除此评论吗？',
      success(res){
        if(res.confirm){
          var index = event.currentTarget.dataset.index
          wx.cloud.database().collection('actions').doc(event.currentTarget.dataset.id).get({
            success(res){
              console.log(res)
              var action = res.data

              action.commentList.splice(index,1)
              wx.cloud.database().collection('actions').doc(event.currentTarget.dataset.id).update({
                data: {
                  commentList: action.commentList
                },
                success(res){
                  console.log(res);
                  wx.showToast({
                    title: '删除成功',
                    icon:'none'
                  })
                  that.getActionsList();
                }
              })
            }
          })
        }else if(res.cancel){

        }
      }
    })
  },


  // 分享事件
  onShareAppMessage(event){
    // console.log(event);
    // console.log(event.target.dataset.idnex);
    // 点击分享按钮触发
    if(event.from=='button'){
      var index=event.target.dataset.idnex;
      return{
        // 标题
        title:this.data.actionsList[index].text,
        // 图片
        imageUrl:this.data.actionsList[index].images[0],  
        // 点击打开后跳转到详情页面
        path:'../../pages/share_detail/share_detail?id='+this.data.actionsList[index]._id
      }
    }
    // 点击菜单的分享按钮触发
    if(event.from=='menu'){
      return{
        // 标题
        title:'云约吧',
        // 云存储中的图片
        imageUrl:'cloud://basic-2wp9o.6261-basic-2wp9o-1302282056/my-image.png',
        // 新闻首页
        path:'../../pages/news_index/news_index'
      }
    }

  }

})

