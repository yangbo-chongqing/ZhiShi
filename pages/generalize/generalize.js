const util = require('../../utils/util.js');
const api = require('../../config/api.js');
Page({
 
  data: {
    name: "",
    idcard: "",
    address: "",
    phone: "",
    type: "",
    reason: "",
    array:[{id:1,name:'兼职'},{id:2,name:'全职'}]
  },

  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  radioChange: function (e) {
    let that = this;
    that.setData({
      reason: e.detail.value,
    })
  },
  attribute: function (e) {
    let that = this;
    wx.showActionSheet({
      itemList: ['兼职', '全职'],
      success: function (res) {
        console.log(res.tapIndex);
        that.setData({
          xx: res.tapIndex
        })
      }
    })
  },
  /**
   * 获取用户输入数据
   * @param {} e 
   */
  name: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  idcard: function (e) {
    this.setData({
      idcard: e.detail.value
    })
  },
  address: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  phone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
 
 //申请成为推广者
  onPromote: function () {
    let that = this;
    let name = that.data.name;
    let idcard = that.data.idcard;
    let address = that.data.address;
    let phone = that.data.phone;
    let type = this.data.array[that.data.index].id;
    let reason = that.data.reason;
    if (name == "") {
      util.toast("请输入姓名")
      return false;
    }
    if (idcard == "") {
      util.toast("请输入身份证号")
      return false;
    }
    if (address == "") {
      util.toast("请输入地址")
      return false;
    }
    if (phone != '' && !/^1[3456789]\d{9}$/.test(phone)) {
      util.toast("请输入正确电话")
      return false;
    }
    if (phone == "") {
      util.toast("请输入联系号码")
      return false;
    }
    // if (type == "") {
    //   util.toast("请选择属性")
    //   return false;
    // }
    if (reason == "") {
      util.toast("请选择申请原因")
      return false;
    }
    util.request(api.AddPromote, {
      name: name,
      idcard: idcard,
      address: address,
      phone: phone,
      types: type,
      reason: reason
    }).then(function (res) {
      console.log(res)
      if (!res) {
        util.toast("身份信息不匹配")
       return false;
      }
      util.toast("欢迎您！加入我们")
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        })
      }, 2000);
    });
    return true;
  },
  onNo:function(){ 
      wx.navigateBack({
        delta: 1
      });
  }
})