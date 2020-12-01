const util = require('../../utils/util.js');
const api = require('../../config/api.js');

Page({

  data: {
    userCollect: "",
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    util.request(api.GoodCollect).then(function (res) {
       let userCollect =res.data;
        that.setData({
          userCollect: userCollect
        })
    })
  },
  /**
   * 取消收藏
   */
  unCollect: function (e) {
    let that = this;
    let id = e.target.dataset.id;
    util.request(api.collect, {
      GoodID: id,
      flag: true
    }).then(function (res) {
      if (res.data == true) {
        setTimeout(function () {
          that.onShow()
        }, 1000);
      }
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  }
})