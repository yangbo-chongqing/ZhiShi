const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    showLoginDialog: false
  },

  //是否为推广用户
  onLoad: function (options) {
    let that = this;
    //用户是否为--系统用户
    wx.getSetting({
      success(res) {
        if (res.authSetting["scope.userInfo"]) {
          // 发送请求
          util.login().then((res) => {
            return util.request(api.AuthLoginByWeixin, {
              code: res
            });
          }).then((res) => {
            if (res.data.user != null && res.data.user != "") {
              // 设置用户信息
              that.setData({
                userInfo: res.data.user,
              });
              //全局变量
              app.globalData.userInfo = res.data.user;
              app.globalData.token = res.data.token;
              //缓存
              wx.setStorageSync('userInfo', JSON.stringify(res.data.user));
              wx.setStorageSync('token', res.data.token);
            }
          }).catch((err) => {
            console.log(err)
          })
        } else {
          let sharerID = options.id;
          if(sharerID ==undefined){
            sharerID = app.globalData.sharerID;  
          }
          console.log("分享者ID：" + sharerID)
          //新用户是否为分享用户 -- 及是否为课程分享活动课程的用户
          if (sharerID) {
            that.setData({
              showLoginDialog: true
            });
            app.globalData.sharerID = sharerID;
          }
        }
      }
    })
  },

  onShow: function () {
    this.setData({
      userInfo: app.globalData.userInfo,
    });
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') { // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '七彩云',
      path: 'pages/center/center?id=' + app.globalData.userInfo.userID,
      success: function (res) {
        console.log("成功")
      },
      fail: function (res) {
        console.log("失败")
      }
    }
  },
  //新用户不是分享用户--登录
  getUserInfo: function (e) {
    let that = this;
    //点击判断授权登录
    if (e.detail.errMsg !== 'getUserInfo:ok') {
      if (e.detail.errMsg === 'getUserInfo:fail auth deny') {
        return false
      }
      wx.showToast({
        title: '微信登录失败',
      })
      return false
    }
    //  发送请求
    util.login().then((res) => {
      return util.request(api.AuthLoginByWeixin, {
        nickName: e.detail.userInfo.nickName,
        avatarUrl: e.detail.userInfo.avatarUrl,
        gender: e.detail.userInfo.gender,
        code: res
      });
    }).then((res) => {
      if (res.result == "ERROR") {
        wx.showToast({
          title: '登录失败',
        })
        return false;
      }
      // 设置用户信息
      that.setData({
        userInfo: res.data.user,
      });
      //全局变量
      app.globalData.userInfo = res.data.user;
      app.globalData.token = res.data.token;
      //缓存
      wx.setStorageSync('userInfo', JSON.stringify(res.data.user));
      wx.setStorageSync('token', res.data.token);
    }).catch((err) => {
      console.log(err)
    })
  },
  //推广
  isPromote: function () {
    //判断用户是否为推广
    let that = this;
    let is = that.data.userInfo.user_Level;
    if (is == undefined) {
      wx.navigateTo({
        url: '../generalize/generalize',
      });
    }
    if (is == 0) {
      //申请状态
      util.request(api.SelectPromote).then(function (res) {
        console.info(res.data)
        if (res.data == "") {
          //申请通过
          wx.navigateTo({
            url: '../generalize/generalize',
          })
        }else if (res.data == 0) {
          //申请通过
          wx.navigateTo({
            url: '../deposit/deposit',
          })
        } else if (res.data == 1) {
          util.toast("申请中");
        } else {
          //失败
          util.toast(res.data);
          setTimeout(function () {
            wx.navigateTo({
              url: '../generalize/generalize',
            });
          }, 2000);
        }
      });
    } else {
      //推广者
      wx.navigateTo({
        url: '../deposit/deposit',
      })
    }
  },

  //新用户是分享用户 -- 登录，res：状态  e.datail 获取微信账号信息  
  onWechatLogin: function (e) {
    let that = this;
    //点击判断授权登录
    if (e.detail.errMsg !== 'getUserInfo:ok') {
      if (e.detail.errMsg == 'getUserInfo:fail auth deny') {
        return false
      }
      return false
    }
    //  发送请求
    util.login().then((res) => {
      return util.request(api.AuthLoginByWeixin, {
        nickName: e.detail.userInfo.nickName,
        avatarUrl: e.detail.userInfo.avatarUrl,
        gender: e.detail.userInfo.gender,
        code: res
      });
    }).then((res) => {
      if (res.result == "ERROR") {
        wx.showToast({
          title: '登录失败',
        })
        return false;
      }
      that.setData({
        showLoginDialog: false
      })
      // 设置用户信息
      that.setData({
        userInfo: res.data.user,
      });
      //全局变量
      app.globalData.userInfo = res.data.user;
      app.globalData.token = res.data.token;
      //缓存
      wx.setStorageSync('userInfo', JSON.stringify(res.data.user));
      wx.setStorageSync('token', res.data.token);
      util.promote();
    }).catch((err) => {
      console.log(err)
    })
  },
  
})