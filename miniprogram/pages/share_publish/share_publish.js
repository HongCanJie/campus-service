
Page({
  data: {
    // 云端图片地址
    cloudImgList:[]
  },

  // 获取文本框的值
  getValue(e){
    // console.log(e.detail.value);
    this.setData({
      inputValue:e.detail.value
    })
  },

  // 选择图片事件
  chooseImage(){
    var that=this;
    wx.chooseImage({
      // 图片最大个数
    count:9-that.data.cloudImgList.length,
    sizeType:['original','compressed'],
    sourceType:['album','camera'],
    success(res){
      // console.log(res.tempFilePaths);
      // 上传图片
      that.data.tempImgList=res.tempFilePaths;
      that.uploadImages();
    }
    })
  },

// 图片上传到云端
  uploadImages(){
    var that=this;
    // 循环遍历上传
    for(var i=0;i<this.data.tempImgList.length;i++){
      wx.cloud.uploadFile({
        // 存储到云端的图片命名
        cloudPath:`actionImages/${Math.random()}_${Date.now()}.${this.data.tempImgList[i].match(/\.(\w+)$/)[i]}`,
        // 图片路径
        filePath:this.data.tempImgList[i],
        success(res){
          console.log(res.fileID);
          // 云端返回的图片路径添加到data中的数组
          that.data.cloudImgList.push(res.fileID);
          that.setData({
            cloudImgList:that.data.cloudImgList
          })
        }
      })
    }
  },

  // 删除图片
  deleteImg(e){
    // console.log(e.currentTarget.dataset.index);
    // 指定下标值删除数组中的元素
    this.data.cloudImgList.splice(e.currentTarget.dataset.index,1);
    this.setData({
      cloudImgList:this.data.cloudImgList
    })
  },

  // 发表按钮
  submitData(){
    wx.showLoading({
      title: '发布中',
      mask:'true'
    })
    // 获取缓存中的用户数据
    const userInfo=wx.getStorageSync('userInfo');
    // 将整条上传到云数据库中
    wx.cloud.database().collection('actions').add({
      data:{
        // 用户名
        nickName:userInfo.nickName,
        // 头像
        faceImg:userInfo.avatarUrl,
        // 文本
        text:this.data.inputValue,
        // 图片
        images:this.data.cloudImgList,
        // 时间
        time:Date.now(),
        // 点赞
        prizeList:[],
        // 评论
        commentList:[]
      },
      success(res){
        // console.log(res);
        wx.navigateBack({
          delta: 1,
          success(res){
            wx.hideLoading();
              wx.showToast({
                title: '发布成功!',
                icon:'none'
              })
          }
        })
      }

    })
  },
})