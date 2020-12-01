const util = require('../../utils/util.js');
const api = require('../../config/api.js');
Page({
 
  data: {
    orderList: "",
  },
  onShow: function () {
    let that = this;
    that.getdata();
  },

  //获取订单
  getdata:function(){
    let that = this;
    util.request(api.GoodList).then(function (res) {
      let list = res.data; 
        that.setData({
          orderList: list
        })
    })
  },

  //删除订单e
  delete:function(e){
    let that  = this
    wx.showModal({
      title: '删除订单',
      content: '确定要删除该订单？',
      showCancel: true,//是否显示取消按钮
      success: function (res) {
         if (res.cancel) {
            //点击取消,默认隐藏弹框
         } else {
          let orderID = e.currentTarget.dataset.id;
          util.request(api.deletedOrder,{OrderID:orderID}).then(function (res) {
            console.log(res);
            if(res.result == "SUCCESS"){
              util.toast("删除成功");
              that.getdata();
            }else{
              util.toast(res.msg);
            }
          })
         }
      }
   })
    
  },

  // 支付
  pay:function(e){
    var that = this;
    wx.showLoading({
      title: '支付中',
      mask:true
    })
    let orderID = e.currentTarget.dataset.id;
    util.payOrder(orderID).then(function(){
      util.toast(res.msg);
      that.getdata();
    }).catch(function(res){
      util.toast(res.msg);
      that.getdata();
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

})