// 使用云数据库
const db=wx.cloud.database();
const news=db.collection('news');
Page({

  data: {
    num:0
  },

  onShow:function () {
    this.getData();
  },

  getData: function () {
    // 获取缓存中的key
    let info=wx.getStorageInfoSync();
    let keys=info.keys;
    let num=keys.length;
    // console.log(info);
    // console.log(keys);
    let myList=[];
    // 通过缓存中的key查询数据库获取数据
    for(var i=0;i<num;i++){
      var that=this
      news.doc(keys[i]).get({
        success(res){
          // console.log(res);
          myList.push(res.data);
          that.setData({
            // num:num,
            newsList:myList
          })
        }
      })
    }
  },

  // getData(){
  //   let myList=wx.getStorageSync('83cfc1ac61928d3302632f0d08e88517');
  //   this.setData({
  //     newsList:myList
  //   })
  // },


    // 下拉刷新数据
    onPullDownRefresh(){
      this.setData({
        newsList:[]
      })
      this.getData();
    }





})