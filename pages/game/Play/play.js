const api = require('../../../config/api')
const util = require('../../../utils/util')
const app = getApp();
Page({
  data: {
    phone: app.globalData.userInfo.mobile,//手机号码
    showAdd: true, //显示添加
    index: 0,
    multiArray: [['无脊柱动物', '脊柱动物'], ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物']],
  },

  onLoad: function (options) { 
    let UserInfo = app.globalData.userInfo;
    let time = UserInfo.last_Login_Time;
    if (time == undefined) {
      util.toast("请先登录")
      wx.switchTab({
        url: '../center/center',
      })
    } else {
      this.setData({
        UserInfo
      })
      this.getdata(); 
      wx.hideLoading();
    }
  },

  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'];
            data.multiArray[2] = ['猪肉绦虫', '吸血虫'];
            break;
          case 1:
            data.multiArray[1] = ['鱼', '两栖动物', '爬行动物'];
            data.multiArray[2] = ['鲫鱼', '带鱼'];
            break;
        }
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
      case 1:
        switch (data.multiIndex[0]) {
          case 0:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['猪肉绦虫', '吸血虫'];
                break;
              case 1:
                data.multiArray[2] = ['蛔虫'];
                break;
              case 2:
                data.multiArray[2] = ['蚂蚁', '蚂蟥'];
                break;
              case 3:
                data.multiArray[2] = ['河蚌', '蜗牛', '蛞蝓'];
                break;
              case 4:
                data.multiArray[2] = ['昆虫', '甲壳动物', '蛛形动物', '多足动物'];
                break;
            }
            break;
          case 1:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['鲫鱼', '带鱼'];
                break;
              case 1:
                data.multiArray[2] = ['青蛙', '娃娃鱼'];
                break;
              case 2:
                data.multiArray[2] = ['蜥蜴', '龟', '壁虎'];
                break;
            }
            break;
        }
        data.multiIndex[2] = 0;
        break;
    }
    console.log(data.multiIndex);
    this.setData(data);
  },

  // 获取孩子信息
  getdata: function () {
    var that = this;
    util.request(api.selectChildNoSign, {
      GoodID: that.data.GoodID
    }).then((res) => {
      console.log(res);
      if (res.result == "SUCCESS") {
        that.setData({
          child: res.data
        })
      } else {
        util.toast(res.msg)
      }
    })
  },

  bindPickerChangeChild: function (e) {
    this.setData({
      childindex: e.detail.value
    })
  },

  //报名
  signUp: function () {
    wx.showLoading({
      title: '支付中',
      mask: true
    }) 
    let SkuID = this.data.skuID;
    let ChildID = this.data.child[this.data.childindex].childID;
    let GoodID = this.data.GoodID;
    let MechanicalID = this.data.MechanicalID;
    let couponID = this.data.changeCouponId;
    couponID = couponID.substring(0, couponID.length - 1);
    // 添加订单掉支付
    util.request(api.signOrder, {
      SkuID,
      ChildID,
      GoodID,
      MechanicalID,
      couponID
    }).then((res) => {
      console.log(res)
      if (res.result == "SUCCESS") {
        util.payOrder(res.data).then(function () {
          util.toast(res.msg);
          wx.redirectTo({
            url: '../order/order',
          })
        }).catch(function (res) {
          util.toast(res.msg);
          wx.redirectTo({
            url: '../order/order',
          })
        });
      } else {
        wx.hideLoading()
        util.toast(res.msg);
      }
    })
  }, 

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getdata();
    wx.hideLoading();
  },
 

})