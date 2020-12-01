const api = require('../../config/api')
const util = require('../../utils/util')  
Page({
 
  data: {
    goodlist:'',
  },
 
  onLoad: function (options) {
    let keyWord = options.keyWord;
    if(keyWord == '' || keyWord == null){
      util.toast("参数错误");
      wx.navigateBack()
      return false;
    }
    this.setData({keyWord})
    this.getdata();
  },

  getdata:function(){
    let that = this;
      util.request(api.search,{keyWord:that.data.keyWord}).then((res)=>{
        that.setData({goodlist:res.data})
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