const api = require('../../config/api')
const util = require('../../utils/util')

Page({
  data: {
    value: "请输入机构课程名称"
  },

  onLoad: function (options) {
    // 获取类型ID如果没有返回上一页
    let id = options.id;
    if(id == "" || id == null){
      wx.navigateBack();
    }
    this.getdata(id);
  },

  getdata:function(TypeId){
    console.log(TypeId);
    var that = this;
    util.request(api.goodSku,{TypeId:TypeId}).then((res)=>{
      console.log(res);
      if(res.result == "SUCCESS"){
        that.setData({
          type:res.data
        })
      }else{
        util.toast(res.msg);
      }
    })
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

  },
 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})