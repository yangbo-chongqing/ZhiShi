const util = require('../../utils/util.js');
const api = require('../../config/api.js');
Page({
 
  data: {
    currentTab: 0,
    coupon: [],
    promptOne: true,
    promptTwo: true,
    promptThree: true,
  },
  //swiper切换时会调用
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  //点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //获取优惠卷
  onShow: function () {
    let that = this;
    //查询
    util.request(api.UserCoupon).then(function (res) {
      let coupon = res.data;
      let promptOne = true;
      let promptTwo = true;
      let promptThree = true;
      for (let c of coupon) {
        //优惠卷类型是否存在数据
        switch (c.Status) {
          case 0:
            promptOne = false;
            break;
          case 1:
            promptTwo = false;
            break;
          case 2:
            promptThree = false;
            break;
        }
      }
      that.setData({
        coupon: coupon,
        promptOne: promptOne,
        promptTwo: promptTwo,
        promptThree: promptThree
      })
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  }, 
 
})