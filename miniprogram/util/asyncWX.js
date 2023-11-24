// promise的形式handleGetUserProfile
export const handleGetUserProfile=()=>{
  return new Promise((resolve,reject)=>{
    wx.getUserProfile({
    desc:'获取用户信息',
     success:(result)=>{
       resolve(result);
     },
     fail:(err)=>{
       reject(err);
     }
   });
  })
}