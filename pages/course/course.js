const api = require('../../config/api')
const util = require('../../utils/util')
var date = new Date();
var currentHours = date.getHours();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    casArray: ['位置1', '位置2', '位置3', '位置4', '位置5'],
    Gender: 'female',
    casIndex: 0,
    show: false,
    price: 0,
    skuID: '', // g规格id
    skuID1: 0, // 规格用户选择的第一级下标
    skuID2: 0, // 规格用户选择的第二级下标
    skuID3: 0, // 规格用户选择的第三级下标
    childindex: 0, // 选择的孩子下标
    childHide: true,
    childindex2: 0,
    child: '',
    ex: '',
    dateTimeArray: '',
    multiArray2: [
      ['今天', '明天', '3-2', '3-3', '3-4', '3-5'],
      ['上午', '下午']
    ],
    multiIndex2: [0, 0],
    appointment: '',
    previewImg: [],
    GoodInfo: '',
    name1: '',
    name2: '',
    name3: '',
    navTab: ['砍价攻略', '好友记录'],
    currentTab: 0,
    sendList: ['AA', 'BB'],
    tab1: 'tabshow',
    tab2: 'tabhide',
    user: "",
    money: 0,
    count_r: 0,
    isStartCourse: 0,
    timer: "00:00:00", //活动倒计时
    activitytime: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取商品ID如果没有返回上一页
    let  id = options.GoodID;
    let  sharerID = options.id;
    let fixed = wx.getStorageSync('fixed');
    if (id == undefined) {
      util.toast("缺少参数，请退出后重试");
      wx.navigateBack();
    }else if(id !=undefined && sharerID != undefined){
      app.globalData.sharerID =sharerID;
      app.globalData.activityId=id;
      let islogin = app.globalData.userInfo.userID;
      if (islogin != "") {
         util.promote();
     }else{
        util.nav();
     }
    }else if (fixed == "" || fixed == null) {
      this.getLocation();
      return;
    } 
    this.setData({
      GoodID: id, 
      fixed
    })
    wx.showLoading({
      title: '请稍后....',
    })
    this.getdata();
    this.isStartCourse();
    this.morenTime(date.getHours());
  },
  //当前课程是否为活动课程
  isStartCourse() {
    let that = this;
    util.request(api.isActivityCourse, {
      goodId: that.data.GoodID,
    }).then(function (res) {
      that.setData({
        isActivityCourse: res.data,
      });
    })
  },

  getdata: function () {
    var that = this;
    util.request(api.GoodInfo, {
      GoodID: that.data.GoodID,
      fixed: that.data.fixed
    }).then((res) => {
      console.log(res);
      if (res.result == "SUCCESS") {
        // 判断是否拥有机构
        if (res.data.mec != '') {
          let fixed = res.data.mec[0].fixed.split(",");
          let longitude = fixed[0];
          let latitude = fixed[1];
          that.setData({
            marks: [{
              longitude,
              latitude
            }]
          })
        }
        let previewImg = [];
        let pics = res.data.pic;
        if (pics != null) {
          for (let i = 0; i < pics.length; i++) {
            if (pics[i].type == 5) {
              previewImg.push(pics[i].pic);
            }
          }
        }
        that.setData({
          GoodInfo: res.data.goodInfo,
          pic: res.data.pic,
          sku: res.data.sku,
          mec: res.data.mec,
          collection: res.data.collection,
          ex: res.data.ex,
          previewImg,
          GoodInfoContent: res.data.GoodInfoContent
        })
        if (res.data.ex != null) {
          that.order();
        }
        that.setsku();
        wx.hideLoading();
      } else {
        util.toast(res.msg);
        wx.navigateBack();
      }
    })
  },

  // 课程图片预览
  previewImg: function (e) {
    let that = this;
    let pic = e.currentTarget.dataset.pic;
    wx.previewImage({
      current: pic, // 当前显示图片的http链接
      urls: that.data.previewImg // 需要预览的图片http链接列表
    })
  },

  //300活动报名
  activesign: function () {
    let that = this;
    let time = app.globalData.userInfo.last_Login_Time;
    // 验证是否登录
    if (time == undefined) {
      util.nav();
      return false;
    } else {
      let MechanicalID = 0;
      let GoodID = this.data.GoodInfo.id;
      let skuID = this.data.sku[0].id;
      let price = this.data.sku[0].skuPrice;
      let goodname = this.data.GoodInfo.goodName;
      let intro = this.data.GoodInfo.goodIntro;
      let homePic = this.data.GoodInfo.homePic;
      let course = '300体验优惠';
      let parm = {
        MechanicalID,
        GoodID,
        skuID,
        goodname,
        price,
        intro,
        course,
        homePic
      }
      wx.navigateTo({
        url: '../signUp/signUp?parm=' + JSON.stringify(parm),
      })
    }
  },

  pickerTap: function () {
    date = new Date();
    var monthDay = ['今天', '明天'];
    var hours = [];
    currentHours = date.getHours();

    // 月-日
    for (var i = 2; i <= 28; i++) {
      var date1 = new Date(date);
      date1.setDate(date.getDate() + i);
      let xq = date1.getUTCDay();
      if (xq == 1) {
        xq = "一"
      } else if (xq == 2) {
        xq = "二"
      } else if (xq == 3) {
        xq = "三"
      } else if (xq == 4) {
        xq = "四"
      } else if (xq == 5) {
        xq = "五"
      } else if (xq == 6) {
        xq = "六"
      } else {
        xq = "天"
      }
      var md = (date1.getMonth() + 1) + "-" + date1.getDate() + "星期" + xq;
      monthDay.push(md);
    }

    var data = {
      multiArray2: this.data.multiArray2,
      multiIndex2: this.data.multiIndex2
    };
    let times = [];
    let appointment = "";
    if (currentHours > 12) {
      monthDay = monthDay.splice(1, monthDay.length - 1);
      times.push('上午')
      times.push('下午')
    } else {
      times.push('下午')
    }

    data.multiArray2[0] = monthDay;
    data.multiArray2[1] = times;
    this.setData(data);
  },

  morenTime: function (currentHours) {
    let appointment = '';
    if (currentHours > 12) {
      var date1 = new Date(date);
      date1.setDate(date.getDate() + 1);
      var month = date1.getMonth() + 1;
      var day = date1.getDate();
      if (month < 10) {
        month = "0" + month
      }
      if (day < 10) {
        day = "0" + day
      }
      appointment = date1.getFullYear() + "-" + month + "-" + day + " 上午"
    } else {
      var month = date.getMonth() + 1;
      var day = date.getDate();
      if (month < 10) {
        month = "0" + month
      }
      if (day < 10) {
        day = "0" + day
      }
      appointment = date.getFullYear() + "-" + month + "-" + day + " 下午"
    }
    this.setData({
      appointment
    })
  },

  bindMultiPickerColumnChange2: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray2: this.data.multiArray2,
      multiIndex2: this.data.multiIndex2
    };
    data.multiIndex2[e.detail.column] = e.detail.value;
    data.multiArray2[1] = ['上午', '下午']
    this.setData(data)
  },

  //移动选点
  onChangeAddress: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        var str = res.longitude + "," + res.latitude
        that.setData({
          chooseAddress: res.name,
          fixed: str
        });
        wx.setStorageSync('fixed', str);
        wx.setStorageSync('chooseAddress', res.name)
        that.getdata();
        that.morenTime(date.getHours());
      },
      fail: function (err) {
        console.log(err)
      }
    });
  },

  // 判断授权
  getLocation: function () {
    let _this = this;
    wx.getSetting({
      success(res) {
        // 判断定位的授权
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              console.log("success");
              _this.onChangeAddress();
            },
            fail(errMsg) {
              console.log(errMsg);
              wx.showModal({
                title: '温馨提示',
                content: '请点击小程序<右上角三个点>→<设置>→允许小程序使用位置信息',
                showCancel: true, //是否显示取消按钮
                success: function (res) {
                  wx.navigateBack();
                },
              })
            }
          })
        } else {
          _this.onChangeAddress();
        }
      }
    })
  },

  bindStartMultiPickerChange2: function (e) {
    var that = this;
    var monthDay = that.data.multiArray2[0][e.detail.value[0]];
    var hours = that.data.multiArray2[1][e.detail.value[1]];
    monthDay = monthDay.substring(0, monthDay.length - 4);
    if (monthDay === "今天") {
      var month = date.getMonth() + 1;
      var day = date.getDate();
      if (month < 10) {
        month = "0" + month
      }
      if (day < 10) {
        day = "0" + day
      }
      monthDay = date.getFullYear() + "-" + month + "-" + day
    } else if (monthDay === "明天") {
      var date1 = new Date(date);
      date1.setDate(date.getDate() + 1);
      var month = date1.getMonth() + 1;
      var day = date1.getDate();
      if (month < 10) {
        month = "0" + month
      }
      if (day < 10) {
        day = "0" + day
      }
      monthDay = date1.getFullYear() + "-" + month + "-" + day
    } else {
      var month = monthDay.split("-")[0]; // 返回月
      var day = monthDay.split("-")[1]; // 返回日
      if (month < 10) {
        month = "0" + month
      }
      if (day < 10) {
        day = "0" + day
      }
      monthDay = date.getFullYear() + "-" + month + "-" + day
    }

    var appointment = monthDay + " " + hours;
    this.setData({
      appointment
    })
    console.log(appointment);
  },

  // 处理商品规格
  setsku: function () {
    let that = this;
    // 第一级规格
    let sku = that.data.sku;
    if (sku.length == 0) {
      util.toast("规格错误，请刷新后重试");
      wx.hideLoading()
      wx.navigateBack()
      return;
    }
    // 第二级规格
    let sku1 = sku[that.data.skuID1].goodsku;

    // 第三级规格
    let sku2 = sku1[that.data.skuID2].goodsku;

    let price = 0; // 价格
    let skuID = ''; // 规格id
    // 如果第三极规格为空，则设置第二级参数
    if (sku2 == null) {
      price = sku1[this.data.skuID2].skuPrice
      skuID = sku1[this.data.skuID2].id


    } else {
      price = sku2[this.data.skuID3].skuPrice
      skuID = sku2[this.data.skuID3].id
    }
    that.setData({
      sku,
      sku1,
      sku2,
      price,
      skuID
    })
  },

  // 修改第一级规格
  changesku: function (e) {
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    this.setData({
      skuID1: id,
      skuID2: 0,
      skuID3: 0,
      name1: name
    })
    this.cke();
    this.setsku();
  },

  // 修改第二级规格
  changesku1: function (e) {
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    this.setData({
      skuID2: id,
      skuID3: 0,
      name2: name
    })
    this.cke();
    this.setsku();
  },

  // 修改第三级规格
  changesku2: function (e) {
    let id = e.currentTarget.dataset.id;
    let name3 = e.currentTarget.dataset.name;
    this.setData({
      skuID3: id,
      name3
    })
    this.cke();
    this.setsku();
  },
  //默认选中
  cke: function () {
    let that = this;
    if (that.data.sku1[0].skuActivityDay != undefined || that.data.sku1[0].skuActivityDay != null) {
      that.setData({
        name1: that.data.sku1[that.data.skuID1].skuActivityDay,
        name2: that.data.sku1[that.data.skuID2].skuActivityTime
      })
    } else {
      that.setData({
        name1: that.data.sku[that.data.skuID1].skuClass,
        name2: that.data.sku[that.data.skuID2].skulesson,
        name3: that.data.sku[that.data.skuID2].skuGrede
      })
    }

  },
  //收藏
  collect: function () {
    let that = this;
    let time = app.globalData.userInfo.last_Login_Time;

    if (time == undefined) {
      util.nav();
      return false;
    } else {
      util.request(api.collect, {
        GoodID: that.data.GoodInfo.id,
        flag: that.data.collection
      }).then((res) => {
        if (res.result == "SUCCESS") {
          util.toast("成功")
          that.setData({
            collection: res.data
          })
        } else {
          util.toast("失败")
          util.toast(res.msg)
        }

      })
    }
  },

  //报名页面
  signUp: function () {
    if (this.data.mec == '' || this.data.mec == null) {
      util.toast("该地区机构正在建设中");
      return false;
    }
    let MechanicalID = this.data.mec[this.data.casIndex].id;
    let GoodID = this.data.GoodInfo.id;
    let skuID = this.data.skuID;
    let price = 0;
    let money = this.data.money;
    if (money != 0) {
      price = money;
    } else {
      price = this.data.price;
    }
    let goodname = this.data.GoodInfo.goodName;
    let intro = this.data.GoodInfo.goodIntro;
    let homePic = this.data.GoodInfo.homePic;
    let course = '';
    let maxPrice = '';
    if (this.data.sku2 == null) {
      course = this.data.sku1[this.data.skuID2].skuActivityDay + "," + this.data.sku1[this.data.skuID2].skuActivityTime;
      maxPrice = this.data.sku1[this.data.skuID2].lowestPrice;
    } else {
      course = this.data.sku2[this.data.skuID3].skuClass + "," + this.data.sku2[this.data.skuID3].skulesson + "," + this.data.sku2[this.data.skuID3].skuGrede;
      maxPrice = this.data.sku2[this.data.skuID3].lowestPrice;
    }
    let parm = {
      MechanicalID,
      GoodID,
      skuID,
      goodname,
      price,
      intro,
      course,
      homePic,
      maxPrice
    }
    wx.navigateTo({
      url: '../signUp/signUp?parm=' + JSON.stringify(parm),
    })
  },

  bindPickerChangeChild: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      childindex: e.detail.value
    })
  },

  bindCasPickerChange: function (e) {
    let fixed = this.data.mec[e.detail.value].fixed.split(",");
    let longitude = fixed[0];
    let latitude = fixed[1];
    this.setData({
      casIndex: e.detail.value,
      marks: [{
        longitude,
        latitude
      }]
    })
  },
  placeOrder: function (e) {
    let that = this;
    let show = that.data.show
    if (!show) {
      let time = app.globalData.userInfo.last_Login_Time;
      if (time == undefined) {
        util.nav();
        return false;
      } else {
        util.request(api.selectChildNoSign, {
          GoodID: that.data.GoodInfo.id
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
      }
    }
    that.setData({
      show: !show
    });
    this.cke();
  },

  order: function () {
    console.log("order");
    var that = this;
    util.request(api.selectChildBySign, {
      experlencesignID: that.data.ex.id
    }).then((res) => {
      if (res.result == "SUCCESS") {
        that.setData({
          child: res.data
        })
      } else {
        util.toast(res.msg)
      }
    })
  },

  bindPickerChange2: function (e) {
    this.setData({
      childindex2: e.detail.value
    })
  },

  changechildHide: function () {
    if (this.data.childHide) {
      let time = app.globalData.userInfo.last_Login_Time;
      if (time == undefined) {
        util.nav();
        return false;
      } else if (this.data.child == '') {
        util.toast("暂无可报名宝贝，请先购买活动");
        setTimeout(function () {
          wx.navigateTo({
            url: '../course/course?GoodID=1',
          })
        }, 2000)
        return false;
      }
    }
    this.setData({
      childHide: !this.data.childHide
    })
  },

  //体验报名
  signUpEx: function () {
    let that = this
    let ExID = that.data.ex.id;
    let ChildID = that.data.child[that.data.childindex2].childID;
    let GoodID = that.data.GoodInfo.id;
    let MechanicalID = that.data.mec[that.data.casIndex].id;
    let startTime = that.data.appointment;
    util.request(api.signUpEx, {
      ExID,
      ChildID,
      GoodID,
      MechanicalID,
      startTime
    }).then((res) => {
      console.log(res);
      if (res.result == "SUCCESS") {
        that.changechildHide();
        if (!res.data) {
          util.toast("报名失败");
        } else {
          util.toast("报名成功");
          that.order();
          that.setData({
            childHide: true
          })
        }
      } else {
        util.toast(res.msg)
      }
    })
  },
  countTime() {
    var that = this;
    var appCount = setInterval(function () {
      let leftTime = that.data.activitytime;
      if (leftTime < 1  ||leftTime  == "活动结束") {
        //取消指定的setInterval函数将要执行的代码 
        clearInterval(appCount);
        that.setData({
          activitytime: 0,  
          timer:"本次活动结束"
        })
 
      }else{
        let h = Math.floor(leftTime / 60 / 60 % 60);
        let m = Math.floor(leftTime / 60 % 60);
        let s = Math.floor(leftTime % 60);
        leftTime--;
        that.setData({
          activitytime: leftTime,
          timer: h + ":" + m + ":" + s,
        })
      }
    }, 1000);
  },
   //添加开始
  startactivity() {
    let that = this;
    let islogin = app.globalData.userInfo.userID;
    if (islogin != "") {
      util.request(api.startActivity, {
        goodId: that.data.GoodID
      }).then(function(res){
        if (res.data > 0) {
          that.init()
        }
      });
    } else { 
      util.nav();
    }
  },
  // 用户点击右上角分享
  onShareAppMessage: function (res) {
    let that = this;
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: "限时活动点击0元购",
      path: 'pages/course/course?id=' + app.globalData.userInfo.userID + '&GoodID=' + that.data.GoodInfo.id,
      success: function (res) {
        console.log("成功")
      },
      fail: function (res) {
        console.log("失败")
      }
    }
  },
  currentTab: function (e) {
    if (this.data.currentTab == e.currentTarget.dataset.idx) {
      return;
    }
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    if (e.currentTarget.dataset.idx == 0) {
      this.setData({
        tab1: "tabshow"
      });
      this.setData({
        tab2: "tabhide"
      });
    } else if (e.currentTarget.dataset.idx == 1) {
      this.setData({
        tab1: "tabhide"
      });
      this.setData({
        tab2: "tabshow"
      });
    }
  },

  init(){
    let that = this;
    let islogin = app.globalData.userInfo.userID;
    if (islogin != "") {
      //查询信息
      util.request(api.selectActivityCourse, {
          GoodID: that.data.GoodID
        })
        .then(function (res) {
          if (res.data != null) {
            let activitytime = res.data.activitytime;
            that.setData({
              user: res.data.ActivityUser,
              money: res.data.money,
              count_r: res.data.num,
              activitytime: activitytime
            });
          }
        })
      //用户是否开启活动课程
      util.request(api.isStartActivityCourse, {
        goodId: that.data.GoodID
      }).then(function (res) {
        if (res.data >0){
          that.countTime()
        }
      });
    }
  },
  onShow: function () {
    let that= this;
    that.init();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  },

})