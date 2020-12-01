const api = require('../config/api');
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formdata(midTime) {
  let hh = midTime / 1000 / 60 / 60 % 60;
  let mm = midTime / 1000 / 60 % 60;
  let ss = midTime / 1000 % 60;
  return hh + " : " + mm + " : " + ss;
}
/**
 *
 * 封封微信的的request
 *
 * @param {*} url 
 * @param {*} data 
 * @param {*} method 
 */

function request(url, data, method = "POST") {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.result == "ERROR") {
          if (res.data.msg == "用户不存在，请重新登录" || res.data.msg == "身份异常，请重新登录" || res.data.msg == "访问异常！" || res.data.msg == "非法访问！") {
            toast("身份过期,请重新登录!");
            wx.clearStorageSync();
            setTimeout(function () {
              wx.switchTab({
                url: '../center/center',
              });
            }, 2000)
          } else if (res.data.msg.indexOf("token过期，请重新登录!") >= 0) {
            let token = res.data.msg.replace("token过期，请重新登录!", "");
            getApp().token = wx.setStorageSync('token', token);
          }
          resolve(res.data);
        } else {
          resolve(res.data);
        }
      },
      fail: function (err) {
        reject(err)
      }
    })
  });
}
/**
 * 外部URL访问
 * @param {*} url 
 * @param {*} data 
 * @param {*} method 
 */
function requesturls(url, data, method = "POST") {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      responseType: 'arraybuffer', 
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': wx.getStorageSync('token')
      },
      success: function (res) {
        resolve(res);
      },
      fail: function (err) {
        console.log(res)
        reject(err)
      }
    })
  });
}

function requesturl(url, data, method = "POST") {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': wx.getStorageSync('token')
      },
      success: function (res) {
        resolve(res);
      },
      fail: function (err) {
        console.log(res)
        reject(err)
      }
    })
  });
}

/**
 * 调用微信登录
 */
function login() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (res.code) {
          resolve(res.code);
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
}
/**
 * 获取用户信息
 */
function getUserInfo() {
  return new Promise(function (resolve, reject) {
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        if (res.detail.errMsg === 'getUserInfo:ok') {
          resolve(res);
        } else {
          reject(res)
        }
      },
      fail: function (err) {
        reject(err);
      }
    })
  });
}
 

/**
 * 检查微信会话是否过期
 */
function checkSession() {
  return new Promise(function (resolve, reject) {
    wx.checkSession({
      success: function () {
        resolve(true);
      },
      fail: function () {
        reject(false);
      }
    })
  });
}

/**
 *  支付
 * @param {*} orderId 
 */
function payOrder(orderId) {
  return new Promise(function (resolve, reject) {
    //4.先判断是否登录未登录先登录就调用支付
    request(api.PayPrepayId, {
      orderID: orderId
    }).then((res) => {
      console.log(res);
      wx.hideLoading()
      //5.获取用户返回数据
      if (res.result === "SUCCESS") {
        const payParam = res.data;
        wx.requestPayment({
          'timeStamp': payParam.timeStamp, //时间戳，自1970年以来的秒数
          'nonceStr': payParam.nonceStr, //随机串 
          'package': payParam.package,
          'signType': payParam.signType, //微信签名方式： 
          'paySign': payParam.paySign, //微信签名
          'success': function (res) {
            console.log(res);
            resolve(res);
          },
          'fail': function (res) {
            console.log(res);
            reject(res);
          }
        });
      } else {
        reject(res);
      }
    });
  });
}

/**
 * 提示框
 * @param {*} msg 
 */
function toast(msg) {
  wx.showToast({
    title: msg,
    duration: 2000,
    icon: "none"
  })
}

/**
 * 延迟两秒跳转到个人中心登录
 */
function nav() {
  this.toast("请先登录");
  setTimeout(function () {
    wx.switchTab({
      url: '../center/center',
    })
  }, 2000)
}

/**
 * 分享
 */
function promote() {
  const app = getApp();
  //获得邀请用户 
  let sharerID = app.globalData.sharerID;
  let activityId = app.globalData.activityId;
  console.log(activityId + "************************* " + sharerID)
  if (sharerID != undefined && activityId != undefined) {
    request(api.ActivityCoursecont, {
      goodId: activityId
    }).then((res) => {
      if (res.data == 20) {
        this.toast("活动帮助次数已用完");
        return false;
      } else {
        request(api.AddShareUser, {
          SharerID: sharerID,
          goodId: activityId
        });
      }
    });
  } else if (sharerID != undefined && activityId == undefined) {
    request(api.AddShareUser, {
      SharerID: sharerID,
      goodId: ''
    });
  }
}
module.exports = {
  formatTime: formatTime,
  request,
  checkSession,
  login,
  getUserInfo,
  payOrder,
  toast,
  promote,
  formdata,
  nav,
  requesturl,
  requesturls
}