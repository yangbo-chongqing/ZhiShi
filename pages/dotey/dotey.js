const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const app = getApp();

Page({
  data: {
    childInfo: "",
  },
  
  delete: function (e) {
    let that = this;
    var childID = e.target.dataset.id;
    wx.showModal({
      title: '提示',
      content: '你确定要删除吗？',
      success(res) {
        if (res.confirm) {
          util.request(api.DeleteChild, {
            childID: childID
          }).then(function (res) {
            setTimeout(function () {
              that.onShow()
            }, 1000);
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

 
  onShow: function () {
    let thta = this;
    //查询孩子信息
    util.request(api.SelectChild).then(function (res) {
      let childInfo = res.data;
      console.log(res)
      thta.setData({
        childInfo: childInfo,
      })
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

})