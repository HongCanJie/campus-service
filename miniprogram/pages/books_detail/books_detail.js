const db=wx.cloud.database();
const books=db.collection('books');

Page({

  data: {
    // 定义加载蒙层的显示
    isDownLoading:false,
    // 定义加载进度
    percentNum:0
  },

// 打开图书
  openBook:function (path) {
    wx.openDocument({
      filePath: path,
      success:function (res) {
        console.log('成功打开图书');
      },
      fail:function (error) {
        console.log(error);
      }
    })
  },


// 保存图书
saveBook:function (id,path) {
  var that=this
  wx.saveFile({
    tempFilePath: path,
    success:function (res) {
      // 将文件保存到本地缓存中，下次可直接打开
      let newPath=res.savedFilePath
      wx.setStorageSync(id,newPath)
      // 打开图书
      that.openBook(newPath)
    },
    fail:function (error) {
      console.log(error);
      that.showTips('文件保存失败！')
    }
  })
},

// 图书阅读
readBook:function (e) {
  var that=this
  // 获取图书id
  let id=this.data.books._id;
  // console.log(id);
  // 获取当前图书在云端的地址
  let fileid=this.data.books.fileid;
  // console.log(fileid);
  // 查看本地缓存是否有图片路径
  let path=wx.getStorageSync(id)
  // 从未下载过
  if(path==''){
    // 切换到下载蒙版
    that.setData({
      isDownLoading:true
    })
    // 从云存储中下载图书
    const downloadTask=wx.cloud.downloadFile({
      fileID:fileid,
      // 下载成功
      success:res=>{
        // 关闭加载蒙层
        this.setData({
          isDownLoading:false
        })
        // 保存文件到本地缓存
        if(res.statusCode==200){
          // 获取地址
          path=res.tempFilePath;
          this.saveBook(id,path);
        }
        // 服务器连接成功但下载失败
        else{
          this.showTips('暂时无法下载！')
        }
      },
      // 请求失败
      fail:err=> {
        // 关闭下载时的蒙层
        this.setData({
          isDownLoading:false
        })
        this.showTips('数据获取失败，无法连接到服务器！')
      }
    })

    // 监听文件的下载进度
    downloadTask.onProgressUpdate (function(res) {
      let progress=res.progress;
      that.setData({
        percentNum:progress
      })
    })
  }
  // 之前下载过直接打开
  else{
  // 打开图书
  that.openBook(path)
  }
},

showTips:function (content) {
  wx.showModal({
    title:'提醒',
    content:content,
    // 没有取消按钮
    showCancel:false
  })
},

  onLoad: function (options) {
  // 从云数据库获取当前图书信息
  books.doc(options.id).get({
    success:res=>{
      // console.log(res);
      this.setData({
        books:res.data
      })
    }
  })
  }
})