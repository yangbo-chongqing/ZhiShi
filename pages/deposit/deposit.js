const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const app = getApp();
Page({
 
  data: {
    usermoney:"",//基本信息
    username:"",
    monthMoney:"",//当月收人
    userimage:""
  },

  onLoad: function (options) {
   let that= this;
   that.setData({
    userimage: app.globalData.userInfo.avatar
   })
  },
 
  //推广者个人信息
  onShow: function () {
    let that=this;
    util.request(api.UserMoney).then(function(res){
      that.setData({
        usermoney:res.data.over,
        username:res.data.name,
        monthMoney:res.data.monthMoney,
      })
    });
  }
   
})