const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    Phone: "",
    Massages: "",
    show: true
  },
  mm: function () {
    this.setData({
      show: false
    })
  },
   
  //获取数据
  Phone: function (e) {
    this.setData({
      Phone: e.detail.value
    })
  },
  Massages: function (e) {
    this.setData({
      Massages: e.detail.value
    })
  },

  // 联系方式默认 -- 手机号

  onLoad: function (options) {
    let that = this;
    that.setData({
      Phone: app.globalData.userInfo.mobile
    });
  },


  //  反馈意见
  addFeedBack: function () {
    let that = this;
    let phone = that.data.Phone;
    let massages = that.data.Massages;
    if (phone == null || phone == "") {
      util.toast("请输入联系方式")
      return false;
    }
    if (phone.length != 11) {
      util.toast("号码不正确")
      return false;
    }
    if (phone.length == 11) {
      if (!/^1[3456789]\d{9}$/.test(phone)) {
        util.toast("号码不正确")
        return false;
      }
    }
    if (massages == null || massages == "") {
      util.toast("请输入反馈意见")
      return false;
    }
    util.request(api.UserFeedBack, {
      phone: phone,
      massages: massages
    }).then(function (res) {
      util.toast("感谢支持！")
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        })
      }, 2000);
    })
  },
  placeOrders: function () {
    wx.navigateBack({
      delta: 1
    })
  }
})