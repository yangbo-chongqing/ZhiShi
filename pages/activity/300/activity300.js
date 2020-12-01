const api = require('../../../config/api')
const util = require('../../../utils/util')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '请稍后....',
    })
    let GoodID = options.GoodID;
    let fixed = wx.getStorageSync('fixed');
    if(GoodID == null || GoodID == ''){
      util.toast("参数错误");
      return false;
    }
    this.setData({GoodID,fixed})
    this.getdata();
  },

  getdata:function(){
    var that = this;
    util.request(api.GoodInfo,{GoodID:that.data.GoodID,fixed:that.data.fixed}).then((res)=>{
      console.log(res);
      if(res.result == "SUCCESS"){
        // 判断是否拥有机构
        if(res.data.mec != ''){
          let fixed = res.data.mec[0].fixed.split(",");
          let longitude = fixed[0];
          let latitude = fixed[1];
          that.setData({marks:[{longitude,latitude}]})
        }
        that.setData({
          GoodInfo:res.data.goodInfo,
          pic:res.data.pic,
          sku:res.data.sku,
          mec:res.data.mec,
          collection:res.data.collection,
          ex:res.data.ex,
        })
        wx.hideLoading();
      }else{
        util.toast(res.msg);
      }
    })
  },

  sign:function(){
    let that = this;
    let time = app.globalData.userInfo.last_Login_Time;
   
    if(time == undefined){
      util.toast("请先登录")
      wx.switchTab({
        url: '../center/center',
      })
    }else{
      
      let MechanicalID = null;
      let GoodID = this.data.GoodInfo.id;
      let skuID = this.data.sku[0].id;
      let price = this.data.sku[0].skuPrice;
      let goodname = this.data.GoodInfo.goodName;
      let intro = this.data.GoodInfo.goodIntro;
      let homePic = this.data.GoodInfo.homePic;
      let course = '300体验优惠';
      let parm={MechanicalID,GoodID,skuID,goodname,price,intro,course,homePic}
      wx.navigateTo({
        url: '../../signUp/signUp?parm='+JSON.stringify(parm),
      })
    }
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})