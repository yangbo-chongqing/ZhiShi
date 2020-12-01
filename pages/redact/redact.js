const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const app = getApp();
Page({

  data: {
    chshow: true,
    chindIMG: "https://beichuangera.oss-cn-beijing.aliyuncs.com/imges/head-img.png",
    stage: false,
    tihuoWay: '请选择年级',
    childName: "",
    childIP: "",
    childSchool: "",
    childID: "",
    show:false,
  multiArray:[['幼儿园','小学','初中','高中'],['小班','中班','大班']],
  multiIndex:[0,0]
  },

  /**
   * 获取修改数据
   * @param {} e 
   */
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    if(e.detail.column == 0){
      switch (e.detail.value) {
        case 0:
          data.multiArray[1] = ['小班','中班','大班']
          break;
        case 1:
            data.multiArray[1] = ['一年级','二年级','三年级','四年级','五年级','六年级',]
            break;
        case 2:
            data.multiArray[1] = ['初一','初二','初三']
            break;
        case 3:
            data.multiArray[1] = ['高一','高二','高三']
            break;
      }
      this.setData(data);
    }
    
    
  },

  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let tihuoWay = this.data.multiArray[0][this.data.multiIndex[0]]+","+this.data.multiArray[1][this.data.multiIndex[1]]
    this.setData({
      multiIndex: e.detail.value,
      tihuoWay
    })
  },

  bindDateChange: function (e) {
    var that = this;  
    this.setData({
      date: e.detail.value
    })
  },
  childName: function (e) {
    this.setData({
      childName: e.detail.value
    })
  },
  childIP: function (e) {
    this.setData({
      childIP: e.detail.value
    })
  },
  childSchool: function (e) {
    this.setData({
      childSchool: e.detail.value
    })
  },

  bindShowMsg() {
    let that = this;
    let stage = that.data.stage;
    if (stage == stage) {
      this.setData({
        stage: !stage
      })
    }
  },

  mySelect() {
    var name = this.data.content.contents.name
    console.log(name)
    this.setData({
      tihuoWay: name,
      stage: false
    })
  },

  onLoad: function (options) {
    if (options.childID) {
      this.setData({
        childID: options.childID,
        childName: options.name,
        chindIMG: options.headimg,
        childIP: options.idcard,
        tihuoWay: options.phase,
        childSchool: options.school
      })
    }

  },
  showHide(e) {
    console.log(e);
    var contentFor = this.data.content;
    for (var i = 0; i < contentFor.length; i++) {
      if (e.currentTarget.dataset.changeid == contentFor[i].id) {
        var printPrice = "content[" + i + "].shows";
        if (this.data.content[i].shows) {
          this.setData({
            [printPrice]: false
          });
        } else {
          this.setData({
            [printPrice]: true
          });
        }
      } else {
        var printPrice1 = "content[" + i + "].shows";
        this.setData({
          [printPrice1]: false
        });
      }
    }
  },
  // 图片上传
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1, //最多可以选择的图片总数  
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          chindIMG: tempFilePaths
        })
        //启动上传等待中...  
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 3000
        })
          wx.uploadFile({
            url: "https://jy.cqqxxl.com:8811/child/imagess",
            filePath: tempFilePaths[0],
            //后代接收字段：myfiles
            name: 'myfiles',
            success: function (res) {
              let img = JSON.parse(res.data);
              that.setData({
                chindIMG: img.data.myfiles,
              })
            }, 
          });
      }
    });
  },
  /**
   * 添加孩子信息
   */
  addChild: function () {
    let childID = this.data.childID;
    let Name = this.data.childName;
    let Idcard = this.data.childIP;
    let School = this.data.childSchool;
    let Phase = this.data.multiArray[0][this.data.multiIndex[0]]+","+this.data.multiArray[1][this.data.multiIndex[1]];
    let chindIMG = this.data.chindIMG;
    if (chindIMG == "") {
      util.toast("选择孩子头像")
      return false;
    }
    if (Name == null || Name == "") {
      util.toast("请输入名字")
      return false;
    }
    // if ( Idcard != ""  && !/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(USERPHONE)) {
    //   util.toast("身份证信息错误")
    //   return false;
    // }
    if (School == null || School == "") {
      util.toast("请输入学校")
      return false;
    }
    if (Phase == null || Phase == "") {
      util.toast("请输入学习阶段")
      return false;
    }
    if (Phase == null || Phase == "请选择年级") {
      util.toast("请输入学习阶段")
      return false;
    }

    util.request(api.AddChild, {
      childID,
      childID,
      Name: Name,
      Idcard: Idcard,
      School: School,
      Phase: Phase,
      Headimg: chindIMG
    }).then(function (res) {
      if (res) {
        wx.navigateBack({
          delta: 1,
        });
      } else {
        util.toast("保存失败")
      }
    })
  }

})