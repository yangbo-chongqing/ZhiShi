const ApiRootUrl = 'https://jy.cqqxxl.com/';
// const ApiRootUrl = 'http://localhost:8811/';
module.exports = { 
  AuthLoginByWeixin: ApiRootUrl + 'login/userLogin', //微信登录  
  selectChildNoSign:ApiRootUrl+"order/selectChildNoSign", // 查询当前课程能报名的孩子
  SelectUserIfon: ApiRootUrl + 'user/selectUserInfoById', //个人信息查询
  UpdateUserInfo: ApiRootUrl + 'user/updateUserInfoById', //修改个人信息
  AddChild: ApiRootUrl + 'child/addorUpdate', //添加or修改孩子信息
  DeleteChild: ApiRootUrl + 'child/delete',//删除孩子信息
  SelectChild: ApiRootUrl + 'child/list', //查询孩子信息
  GoodInfo: ApiRootUrl + "good/goodInfo", // 商品详情
  goodSku: ApiRootUrl + "good/type", //商品 分类
  collect:ApiRootUrl+"good/Collect", // 点击收藏
  Home:ApiRootUrl+"home/Home",  //首页
  selectChildBySign:ApiRootUrl+"order/selectChildBySign", // 查询当前体验课程能报名的孩子
  signUpEx:ApiRootUrl+"order/SignUp", // 查询当前体验课程能报名的孩子
  AddPromote:ApiRootUrl+'userPromote/add',//推广申请
  SelectPromote:ApiRootUrl+'userPromote/select', //推广判断申请状态
  UserCoupon:ApiRootUrl+'userCoupon/list',//优惠卷
  goodSku: ApiRootUrl + "good/type", //商品 分类
  GoodInfo: ApiRootUrl + "good/goodInfo", // 商品详情
  GoodList:ApiRootUrl+'order/list', //订单
  GoodCollect:ApiRootUrl+'good/list',//收藏课程
  UserFeedBack:ApiRootUrl+'userFeedback/add',//用户意见反馈
  UserMoney:ApiRootUrl+'userPromote/list',//推广者信息
  AddShareUser:ApiRootUrl+'promo/add',//分享用户
  UserPhone:ApiRootUrl+'user/isPhone',//获取验证码
  AddPhone:ApiRootUrl+'user/addPhone',//添加用户手机号
  PayPrepayId:ApiRootUrl+"pay/wxpay",// 支付
  search:ApiRootUrl+"good/search",// 搜索
  selectCoupon:ApiRootUrl+"order/selectCoupon",   // 根据规格查询可使用的优惠券
  signOrder:ApiRootUrl+"order/signOrder", // 课程报名
  ChildCourseList:ApiRootUrl+'order/childCourseList',//查询孩子课程
  CouponActivity:ApiRootUrl+'activity/activity',//分享
  deletedOrder:ApiRootUrl+"order/deletedCourse", // 删除订单
  isActivityCourse:ApiRootUrl+'activity/isActivityCourse',//查询活动课程ID
  startActivity:ApiRootUrl+'activity/startActivity',//活动课程开始秒杀
  selectActivityCourse:ApiRootUrl+'activity/selectActivityCourse', //活动详情数据
  isStartActivityCourse:ApiRootUrl+'activity/isStartActivityCourse', //用户是否开启活动
  ActivityCoursecont:ApiRootUrl+'activity/ActivityCoursecont', //统计当天用户秒杀活动课程次数
  Activitypublicwelfare:ApiRootUrl+'activity/publicwelfare', //公益活动申请

};