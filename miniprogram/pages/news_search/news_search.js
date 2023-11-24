const db=wx.cloud.database();

Page({

  data: {
    news_search:[],
    // 取消按钮是否显示
    isFocus:false,
    // 输入框的值
    inpValue:""
  },

  // 防抖时间变量
TimeId:-1,

// 输入框的值改变就会触发的事件
handleInput(e){
  // 获取输入框的值
  const {value}=e.detail;
  // 检查输入框值的合法性 注：trim()是去除字符串的前后空格,并检验是否为空
  if(!value.trim()){
    // 输入框没有值时，清空news数组并隐藏取消按钮
    this.setData({
      news_search:[],
      isFocus:false
    })
    // 值不合法
    return;
  }else{
    // 加载提示
  wx.showToast({
    title: '加载中',
    icon:'loading',
    duration:500
  })
  // 准备发送请求获取数据(防抖设计，一般再输入框中使用）
this.setData({
isFocus:true
});
clearTimeout(this.TimeId);//清除定时器，输入第一个字母时不执行
// 等待一段时间
this.TimeId=setTimeout(() => {
  db.collection('news').where({
    title:db.RegExp({
      regexp:value,
      options:'i'
    })
  }).get()
  .then(res=>{
    // console.log(res);
    if(res.data.length>0){
      this.setData({
        news_search:res.data
      }) 
    }else{
      wx.showToast({
        title: '搜索无结果',
        icon:'none',
        duration:500
      })
    }
    // console.log("搜索成功");
  })
}, 1000);
}
},

// 点击取消按钮
handleCancel(){
  this.setData({
    inpValue:"",
    isFocus:false,
    news_search:[]
  })
  },





})