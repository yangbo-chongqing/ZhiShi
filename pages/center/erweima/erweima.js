const util = require('../../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.access_token()
  },

  access_token:function () {
    var that = this
    // 获取access_token
    util.requesturl("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxa25d8f9efe36d58a&secret=67e400f866d94dfde436f9c27145bc91").then((res) => {
      let access_token = res.data.access_token;
      that.setData({access_token})
    })
   
      setTimeout(function () {
         // 获取图片
    let url = "https://api.weixin.qq.com/wxa/getwxacode?access_token="+that.data.access_token
    let a = {
      id:202005227815,
      GoodID:26
    } 
      var parm={
        width:300,
        path:"pages/course/course?id=202005227815&GoodID=26"
      }

        util.requesturls(url,JSON.stringify(parm)).then((res) => {
          let fileManager = wx.getFileSystemManager();//获取文件管理器
            let filePath = wx.env.USER_DATA_PATH + '/inner.jpg';//设置临时路径
            fileManager.writeFile({//获取到的数据写入临时路径
              filePath: filePath,//临时路径
              encoding: 'binary',//编码方式，二进制
              data: res.data,//请求到的数据
              success: function(res) {
                that.setData({imgUrl:filePath})
              }
            });
        })
      },2000)
  },

  shows:function () {
    var that = this;
    wx.previewImage({//图片预览
      urls: [that.data.imgUrl],
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