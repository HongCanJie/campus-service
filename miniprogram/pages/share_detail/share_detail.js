const util = require("../../util/util")

Page({


  data: {
    plcaceHolder:'评论'
  },

  // 删除动态
  delete(){
    var that=this;
    wx.cloud.database().collection('actions').doc(this.data.id).remove({
      success(res){
        // console.log(res);
        wx.navigateBack({
          success(){
            wx.showToast({
              title: '删除成功！',
              icon:'none'
            })
          }
        })
      }
    })
  },

  onLoad: function (options) {
    // 获取缓存中的openid
    const openid=wx.getStorageSync('openid');
    this.setData({
      openid:openid
    })
    // console.log(options.id);
    this.data.id=options.id;
    this.getDetail();
  },

  // 获取数据 
  getDetail(){
     // 获取缓存中的openid
     const openid=wx.getStorageSync('openid');
    var that=this;
    wx.cloud.database().collection('actions').doc(this.data.id).get({
      success(res){
        // console.log(res);
        // 格式化时间
        var action=res.data;
        action.time=util.formatTime(new Date(action.time));
            // 点赞返回值
      for(var l in action.prizeList){
          if(action.prizeList[l].openid ==openid ){
            action.isPrized = true
        } 
     }
    //  时间格式化
    for(var l in action.commentList){
     action.commentList[l].time=util.formatTime(new Date(action.commentList[l].time))
    }
        that.setData({
          action:res.data
        })
      }
    })
  },


    // 点赞事件
    prizeAction(){
      var that = this;
      // 获取缓存中的用户信息
      const userInfo=wx.getStorageSync('userInfo');
      const openid=wx.getStorageSync('openid');
      if(userInfo == null){
        wx.showToast({
          icon: "none",
          title: '请先登录'
        })
      }else {
        // console.log(that.data.id)
        var that = this;
        wx.cloud.database().collection('actions').doc(that.data.id).get({
          success(res){
            // console.log(res)
            var action = res.data
            var tag = false
            var index 
            for(var l in action.prizeList){
              if(action.prizeList[l].openid == openid){
                tag = true
                index = l
                break
              }
            }
            if(tag){
              //之前点赞过 删除点赞记录
              action.prizeList.splice(index,1)
              // console.log(action)
              wx.cloud.database().collection('actions').doc(that.data.id).update({
                data: {
                  prizeList: action.prizeList
                },
                success(res){
  
                  // console.log(res)
                  that.getDetail()
  
                }
              })
            }else{
              //之前未点赞  添加点赞记录
              var user = {}
              user.nickName = userInfo.nickName
              user.faceImg = userInfo.avatarUrl
              user.openid = openid
              action.prizeList.push(user)
  
              // console.log(action.prizeList)
              wx.cloud.database().collection('actions').doc(that.data.id).update({
                data: {
                  prizeList: action.prizeList
                },
                success(res){
                  // console.log(res)
                  wx.showToast({
                    title: '点赞成功！',
                    icon:'none'
                  })
                  that.getDetail()
                }
              })
            }
  
          }
        })
  
      } 
  
    },







      // 下拉刷新
  onPullDownRefresh(){
    // 置空
    this.setData({
      action:[]
    })
    // 重新获取数据
    this.getDetail();
    // 延迟关闭下来刷新
    setTimeout(function () {
      wx.stopPullDownRefresh();
    },1000)
  },

  // 评论信息
  getInputValue(event){
    // console.log(event.detail.value);
    // 获取输入的评论
    this.data.inputValue=event.detail.value;
  },

  // 发布评论
publishComment(){
    var that = this;
    // 获取缓存中的用户信息
    const userInfo=wx.getStorageSync('userInfo');
    const openid=wx.getStorageSync('openid');
    // console.log(userInfo);
    // console.log(openid);
    if(userInfo == null){
        wx.showToast({
          icon: "none",
          title: '请先登录'
        })
    }else {
      // console.log(that.data.id)
      var that = this;
      wx.cloud.database().collection('actions').doc(that.data.id).get({
        success(res){
          // console.log(res)
          var action = res.data
          var comment = {}
          comment.nickName = userInfo.nickName
          comment.faceImg = userInfo.avatarUrl
          comment.openid = openid
          comment.text = that.data.inputValue
          comment.time = Date.now()
          comment.toOpenid = that.data.toOpenid
          comment.toNickname = that.data.toNickname
          action.commentList.push(comment)
          wx.cloud.database().collection('actions').doc(that.data.id).update({
            data: {
              commentList: action.commentList
            },
            success(res){
              // console.log(res)
              wx.showToast({
                title: '评论成功！',
              })
              that.getDetail()
              that.setData({
                inputValue :'',
                plcaceHolder:'评论'
              })
            }
          })


        }
      })

    }
  },




  // 长按删除评论
  deleteComment(event){
    var that = this;
    // console.log(event.currentTarget.dataset.index);
    wx.showModal({
      title:'提示',
      content:'确定要删除此评论吗？',
      success(res){
        if(res.confirm){
          var index = event.currentTarget.dataset.index
          wx.cloud.database().collection('actions').doc(that.data.id).get({
            success(res){
              console.log(res)
              var action = res.data

              action.commentList.splice(index,1)
              wx.cloud.database().collection('actions').doc(that.data.id).update({
                data: {
                  commentList: action.commentList
                },
                success(res){
                  console.log(res);
                  wx.showToast({
                    title: '删除成功',
                    icon:'none'
                  })
                  that.getDetail();
                }
              })
            }
          })
        }else if(res.cancel){

        }
      }
    })
  },

  // 回复评论
  huifuComment(event){
    // index是评论的下角标
    // console.log(event.currentTarget.dataset.index);
    var index=event.currentTarget.dataset.index;
    // 拼接字符串并设置数据
    this.setData({
      plcaceHolder:'回复'+this.data.action.commentList[index].nickName,
      toOpenid:this.data.action.commentList[index].openid,
      toNickname:this.data.action.commentList[index].nickName
    })
  },

    // 分享给好友事件
onShareAppMessage(event){
    return{
      // 标题
       title:this.data.action.text,
      // 图片
     imageUrl:this.data.action.images[0],  
     // 点击打开后跳转到详情页面
      path:'../../pages/share_detail/share_detail?id='+this.data.id
  }
},

  // 分享到朋友圈
  onShareTimeline(){
    return{
      title:this.data.action.text,
      imageUrl:this.data.action.images[0],
      query:'../../pages/share_detail/share_detail?id'+this.data.id
    }
  },
  
  // 预览图片
  previewImg: function(e) {
      // 构造要预览的图片数组
      const urls=e.currentTarget.dataset.url;
      // console.log(urls);
      // console.log(current);
      // 图片预览
      wx.previewImage({
        urls
      })
  },





})