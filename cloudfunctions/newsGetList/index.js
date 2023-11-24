// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:'basic-2wp9o-3glj6daye1518f55',
});
const db=cloud.database();


// 云函数入口函数
exports.main = async (event, context) => {
  var nums=event.nums;
  var page=event.page;
  const news=db.collection("news");
  // const len=news.length;
  return await news.skip(page).limit(nums).get();
}