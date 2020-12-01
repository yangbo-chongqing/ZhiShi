const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const app = getApp();
Page({
 
  data: {
    childCourseList: "",
  },
  //本周孩子课程 
  onShow: function () {
    let that=this;
    util.request(api.ChildCourseList).then(function(res){
      that.setData({
        childCourseList:res.data,
      })
    });
  }, 
})