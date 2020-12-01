const api = require('../../config/api')
const util = require('../../utils/util')
const app = getApp();
Page({
  data: {
    phone: app.globalData.userInfo.mobile,
    childindex: 0,
    couponHide: true,
    money: 0,
    coupon: '',
    couponNum: 0,
    changeCouponId: '',
    child: null,
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '请稍后....',
    })
    let parm = JSON.parse(options.parm);
    // 获取参数验证参数
    let GoodID = parm.GoodID;
    let skuID = parm.skuID;
    let MechanicalID = parm.MechanicalID;
    let ChildID = parm.ChildID;
    let price = parm.price;
    let course = parm.course;
    let goodname = parm.goodname;
    let intro = parm.intro;
    let homePic = parm.homePic;
    let maxPrice = parm.maxPrice;
    if (GoodID == '' || GoodID == null || skuID == '' || skuID == null || price == '' || price == null || course == '' || course == null || goodname == '' || goodname == null || intro == '' || intro == null) {
      util.toast("参数错误");
      wx.navigateBack();
      return;
    }
    this.setData({
      GoodID,
      skuID,
      MechanicalID,
      price,
      money: price,
      ChildID,
      course,
      goodname,
      homePic,
      maxPrice
    })
    // 判断登录获取信息
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
      this.getCoupon();
      wx.hideLoading();
    }

  },

  //如果没有孩子可选择，则跳转到添加宝贝
  zhuanfa: function () {
    wx.navigateTo({
      url: '../redact/redact',
    })
  },

  getdata: function () {
    var that = this;
    // 获取孩子列表
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

  getCoupon: function () {
    var that = this;
    // 获取可使用的优惠券和最多能使用的金额
    util.request(api.selectCoupon, {
      skuId: that.data.skuID
    }).then((res) => {
      console.log(res);
      if (res.result == "SUCCESS") {
        let coupon = res.data.coupon;
        for (let i = 0; i < coupon.length; i++) {
          coupon[i].selected = false;
        }
        that.setData({
          coupon: coupon,
          variable: res.data.variable * that.data.price
        })
      } else {
        util.toast(res.msg)
      }
    })
  },

  // 选择优惠券
  changeCoupon: function (e) {
    let that = this;
    //活动课程不能使用优惠卷
    
    let index = e.currentTarget.dataset.index;
    let coupons = this.data.coupon;
    let coupon = coupons[index]; // 获取选中的优惠券
    let couponNum = this.data.couponNum;
    let GoodID = this.data.GoodID
    let changeCouponId = '';
    //数据类型 --选中数据里面是否存在折扣（折扣优惠二选一）
    let strs = 0;
    let money = 0;
    let moneys = 0;
    //判断选中所有类型一致
    let term = coupon.term;
    let temp = null;
    for (let i = 0; i < coupons.length; i++) {
      if(coupons[i].selected){
        temp = coupons[i].term;
      }
    }
    if(temp != null && temp != term){
        util.toast("活动卷不可叠加");
        return false;
    } 
    if (GoodID == 1) {
      if ((couponNum + coupon.preferentialprice) > 300) {
        util.toast("已达到优惠券使用上限");
        return false;
      }
    }
    strs = "coupon[" + index + "].selected";
    this.setData({
      [strs]: true
    })
    if (coupon.term == 1) {
      moneys += that.data.price * coupon.preferentialprice;
      money += that.data.price * coupon.preferentialprice;
    } else {
      if ((this.data.money - coupon.preferentialprice) < this.data.maxPrice) {
        util.toast("已达到优惠券使用上限");
        return false;
      }
      for (let i = 0; i < coupons.length; i++) {
        if (coupons[i].selected) {
          money += coupons[i].preferentialprice
          changeCouponId += coupons[i].id + ","
        }
      }
      moneys = this.data.money - coupon.preferentialprice;
    }
    if (GoodID == 1 && moneys == 0) {
      moneys = 1;
    }
    this.setData({
      changeCouponId,
      couponNum: money,
      money: moneys,
    })
  },

  // 取消选择优惠券
  reduceCoupon: function (e) {
    let index = e.currentTarget.dataset.index;
    let coupons = this.data.coupon;
    let changeCouponId = '';
    let coupon = coupons[index]; // 获取选中的优惠券
    let strs = "coupon[" + index + "].selected";
    let money = 0;
    this.setData({
      [strs]: false
    })
    for (let i = 0; i < coupons.length; i++) {
      if (coupons[i].selected) {
        money += coupons[i].preferentialprice
        changeCouponId += coupons[i].id + ","
      }
    }
    let str = "coupon[" + index + "].selected";
    coupon.term
    this.setData({
      changeCouponId,
      couponNum: money,
      money: this.data.money + coupon.preferentialprice,
    })
  },

  bindPickerChangeChild: function (e) {
    this.setData({
      childindex: e.detail.value
    })
  },

  changecoupon: function () {
    if (this.data.coupon == '') {
      util.toast("暂无可使用的优惠券")
      return false;
    }
    this.setData({
      couponHide: !this.data.couponHide,
    })
  },

  //报名
  signUp: function () {
    wx.showLoading({
      title: '支付中',
      mask: true
    })
    if (this.data.child.length <= 0) {
      wx.hideLoading();
      util.toast("请添加宝贝");
      setTimeout(function () {
        wx.redirectTo({
          url: '../dotey/dotey',
        })
      }, 1500);
      return false;
    }
    if (this.data.phone == '') {
      util.toast("请输入完整");
      setTimeout(function () {
        wx.redirectTo({
          url: '../datum/datum'
        })
      }, 1500);
      return false;
    }
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getdata();
    this.getCoupon();
    wx.hideLoading();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

})