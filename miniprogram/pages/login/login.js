import {handleGetUserProfile} from "../../util/asyncWX";

Page({
  // 登录点击授权,获取用户数据
  async handleGetUserProfile(e){
  const {userInfo}=await handleGetUserProfile();
  console.log(userInfo);
  wx.setStorageSync('userInfo', userInfo);
  wx.setStorage({
    key: 'login',
    data: true,
    })
  wx.navigateBack({
     delta: 1,
  })
  var that=this;
   // 调用云函数获取用户openid
   wx.cloud.callFunction({
    name: 'login',
    complete: res => {
      // console.log('云函数获取到的openid: ', res.result)
      var openid = res.result.openid;
      that.setData({
        openid: openid
      })
      // openid存入缓存中
      wx.setStorage({
        key: 'openid',
        data: that.data.openid
      })
    }
  })
  }

})
