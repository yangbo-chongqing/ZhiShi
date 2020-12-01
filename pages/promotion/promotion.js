const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoginDialog: false,
    second: "",
    phone: "",
    restConde: "",
  },

  onLoad: function (options) {
    let that = this;
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
              //全局变量
              app.globalData.userInfo = res.data.user;
              app.globalData.token = res.data.token;
              //缓存
              wx.setStorageSync('userInfo', JSON.stringify(res.data.user));
              wx.setStorageSync('token', res.data.token);
              //已经注册
              wx.switchTab({
                url: '../center/center'
              });
            }
          }).catch((err) => {
            console.log(err)
          })
        } else {
          if (options.id) {
            app.globalData.sharerID = options.id; //分享者ID
          }
          wx.authorize({
            scope: 'scope.userInfo',
            fail: function (res) {
              that.setData({
                showLoginDialog: true
              })
            }
          })
        }

      }

    })

  },
  /* 
   * res：状态  e.datail 获取微信账号信息
   * 微信登陆单点登陆
   */
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
  // 手机号
  getPhone: function (e) {
    let that = this;
    var val = e.detail.value;
    if (val.length == 11) {
      if (!(/^1[34578]\d{9}$/.test(val))) {
        util.toast("号码错误");
      } else {
        that.setData({
          phone: val
        })
      }
    }
  },
  //验证码
  getcode: function (e) {
    let that = this;
    let val = e.detail.value;
    let code = that.data.restConde;
    if (val.length == 6) {
      if (code != val) {
        util.toast("验证码错误");
      }else{
        that.setData({
          cond: val
        })
      }
    }  
     
  },
  /* 判断验证码 */
  countdown: function () {
    var that = this;
    let hp = that.data.phone;
    if (hp === null || hp === '') {
      util.toast("手机号不能为空");
    } else {
      util.request(api.UserPhone, {
        phone: hp
      }).then(function (res) {
        if (res.data == "ERROR") {
          util.toast("错误信息");
          return false;
        } else {
          that.setData({
            restConde: res.data
          });
        }
      });
      var nsecond = 60;
      var appCount = setInterval(function () {
        nsecond -= 1;
        that.setData({
          second: nsecond + ' 秒'
        })
        //允许超过时间验证码依然有效 that.data.cond == that.data.restConde
        if (that.data.cond == 1) {
          clearInterval(appCount);
        }
        if (nsecond < 1) {
          //取消指定的setInterval函数将要执行的代码 
          clearInterval(appCount);
          that.setData({
            second: 0,
          })
        }
      }, 1000);
    }
  },
  /**
   *  添加
   */
  addPhone: function () {
    //判断信息
    let that = this;
    let phone = that.data.phone;
    let cond = that.data.cond;
    if (phone == null || phone == "" || cond == null || cond == "") {
      util.toast("请输入完整信息")
    } else {
      util.request(api.AddPhone, {
          phone: phone
        })
        .then(function (res) {
          if (res.data = true) { 
            //更新全局变量
            app.globalData.userInfo.mobile = phone;
            wx.switchTab({
              url: '../center/center'
            });
          }
        })
    }
  }
})