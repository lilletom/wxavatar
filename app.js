App({
  onLaunch: function () {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用getUserInfo获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将res发送给后台解码出unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo是网络网络请求，可能会在Page.onLoad之后才返回
              // 所以此处加入callback以防止这种情况
              if (this.userInfoReadyCallback){
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})