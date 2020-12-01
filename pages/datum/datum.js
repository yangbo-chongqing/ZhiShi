const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const app = getApp();
Page({
  data: {
    items: [{
        index: 0,
        value: '爸爸'
      },
      {
        index: 1,
        value: '妈妈',
      },
    ],
    userName: "",
    gender: "",
    address: "",
    mobile: "",
    emergencycall: "",
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  //初始化显示
  onShow: function () {
    let that = this;
    util.request(api.SelectUserIfon).then(function (res) {
      if (res.data != null) {
        //更新全局变量
        app.globalData.userInfo = res.data;
        //更新缓存
        wx.setStorageSync('userInfo', JSON.stringify(res.data));
        that.setData({
          userName: res.data.userName,
          gender: res.data.gender,
          address: res.data.address,
          mobile: res.data.mobile,
          emergencycall: res.data.emergencycall
        });
      }

    });
  },

  //保存修改用户信息
  updateUserInfo: function () {
    var userName = this.data.userName;
    var gender = this.data.gender;
    var address = this.data.address;
    var mobile = this.data.mobile;
    var emergencycall = this.data.emergencycall;
    if (!userName) {
      util.toast("名字不能为空")
      return false;
    }
    if (!address) {
      util.toast("地址不能为空")
      return false;
    }
    if (!mobile) {
      util.toast("号码不能为空")
      return false;
    }
    util.request(api.UpdateUserInfo, {
      'userName': userName,
      'gender': gender,
      'address': address,
      'mobile': mobile,
      'emergencycall': emergencycall
    }).then(function (res) {
      wx.switchTab({
        url: '../center/center'
      });
    })
  },
  //获取时时数据
  radioChange: function (e) {
    this.setData({
      gender: e.detail.value
    })
  },
  userName: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  gender: function (e) {
    this.setData({
      gender: e.detail.value
    })
  },
  address: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  mobile: function (e) {
    let ph = e.detail.value;
    if (ph.length == 11) {
      if (!/^1[3456789]\d{9}$/.test(ph)) {
        util.toast("号码不正确")
      } else {
        this.setData({
          mobile: ph
        })
      }
    }
  },
  emergencycall: function (e) {
    let emergencycall = e.detail.value;
    console.log(emergencycall)
    if (emergencycall.length == 11) {
      if (!/^1[3456789]\d{9}$/.test(emergencycall)) {
        util.toast("号码不正确")
      } else {
        this.setData({
          emergencycall: emergencycall
        })
      }
    }
  },
})