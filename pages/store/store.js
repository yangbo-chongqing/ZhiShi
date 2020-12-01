const api = require('../../config/api')
const util = require('../../utils/util')
const amapFile = require('../../utils/amap-wx.js'); //如：..­/..­/libs/amap-wx.js
const myAmapFun = new amapFile.AMapWX({
  key: 'cc4e518bb30ad16bee1a60b561f2d0bf'
});
const  app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '输入你想要的...',
    indicatorDots: true, //是否出现焦点
    autoplay: true, //是否自动播放轮播图
    interval: 4000, //时间间隔
    duration: 1000, //延时时间
    circular: true, //是否循环
    goodlist: '',
    announcement: '',
    showModal: false,
    tk: '',
    activitycouse:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let UserID = 1;
    util.request(api.Home, UserID).then((res) => {
      let banner = res.data.banner
      let type = res.data.type
      let favorite = res.data.favorite
      let activity = res.data.activity
      let activitycouse= res.data.activityByID
      let announcement = res.data.announcement
      let tk = res.data.tk
      let showModal = true;
      if (tk == '') {
        showModal = false;
      }
      that.setData({
        banner,
        type,
        favorite,
        activity,
        announcement,
        activitycouse,
        tk,
        showModal
      })
    })
    this.getaddress();
    this.onReady();
  },

  getdata: function (e) {
    let that = this;
    let con = e.detail.value;
    that.setData({
      con
    })
    if (con) {
      util.request(api.search, {
        keyWord: con,
      }).then((res) => {
        that.setData({
          goodlist: res.data,
          sishow: true,
        })
      })
    } else {
      that.setData({
        sishow: false,
      })
    }
  },

  // 改变定位
  //移动选点
  onChangeAddress: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        var str = res.longitude + "," + res.latitude
        that.setData({
          chooseAddress: res.name,
          fixed: str
        });
        wx.setStorageSync('fixed', str);
        wx.setStorageSync('chooseAddress', res.name)
      },
      fail: function (err) {
        console.log(err)
      }
    });
  },

  // 判断授权
  getLocation: function () {
    let _this = this;
    wx.getSetting({
      success(res) {
        // 判断定位的授权
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              console.log("success");
              _this.onChangeAddress();
            },
            fail(errMsg) {
              console.log(errMsg);
              wx.showModal({
                title: '温馨提示',
                content: '请点击小程序<右上角三个点>→<设置>→允许小程序使用位置信息',
                showCancel: true, //是否显示取消按钮
              })
            }
          })
        } else {
          _this.onChangeAddress();
        }
      }
    })
  },

  // 获取定位
  getaddress: function () {
    var that = this;
    myAmapFun.getRegeo({
      success: function (data) {
        //成功回调
        let fixed = data[0].longitude + "," + data[0].latitude;
        that.setData({
          fixed,
          chooseAddress: data[0].desc
        });
        wx.setStorageSync('fixed', fixed);
        wx.setStorageSync('chooseAddress', data[0].desc)
      },
      fail: function (info) {
        // util.toast(info.errCode)
        that.setData({
          info: info.errCode
        })
        // util.toast("定位获取失败");
      }
    })
  },

  onReady: function () {
    setInterval(() => {
      this.setData({
        ok: true
      })
    }, 5000)
  },

  ok: function () {
    this.setData({
      showModal: false
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') { // 来自页面内转发按钮
    }
    return {
      title: "",
      path: 'pages/center/center?id=' + app.globalData.userInfo.userID,
      success: function (res) {
        // 转发成功
        console.info(res+"成功")
      },
      fail: function (res) {
        // 转发失败
        console.log("用户点击了取消", res)
      }
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  }

})