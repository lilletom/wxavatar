var context = null;

//获取应用实例
const app = getApp()
Page({
  data: {
    save: false,
    src: '',
    hat: {
      url: '/pages/img/3.png',
      w: 256,
      h: 256,
      x: 0,
      y: 0,
      b: 1,
    },
  },
  onLoad: function() {
    
  },

  // 生成随机数
  getRandom(start, end, fixed=0){
    let differ = end-start
    let random = Math.random()
    return (start +differ * random).toFixed(fixed)
  },

  // 自动更改挂件图片
  updateImg(n){
    this.setData({
      "hat.url": '/pages/img/'+ n +'.png'
    })
  },

  // 获取微信头像
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    let url = e.detail.userInfo.avatarUrl
    var result = url.replace(/\d{1,3}$/, '0')
    this.setData({
      src: result,
    })
    this.openFun();
  },

  // 下载到本地(头像需先下载到本地方可绘制)
  openFun() {
    let that = this;
    wx.downloadFile({
      url: that.data.src,
      success: function (res) {
        // console.log(res.tempFilePath);
        that.setData({
          src: res.tempFilePath,
        })
        //绘图方法
        that.drawAvatar();

      }, fail: function (fres) {

      }
    })
  },

  // 选择头像图片
  upload() {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        console.log(res)
        that.setData({
          src: res.tempFilePaths[0]
        })
        that.drawAvatar()
      }
    })
  },


  // 绘制头像背景
  drawAvatar() {
    let n = this.getRandom(1, 4);
    this.updateImg(n);
    let p = this.data;
    context = wx.createCanvasContext('myAvatar', this);
    context.clearRect(0, 0, 256, 256)
    context.drawImage(p.src, 0, 0, 256, 256);
    context.draw(true);
    context.save();
    context.drawImage(p.hat.url, 0, 0, 256, 256);
    context.draw(true);
    context.save();
    this.setData({
      save: true
    })
  },

  // 保存图片
  saveImg() {
    wx.canvasToTempFilePath({
      canvasId: 'myAvatar',
      success(res) {
        console.log(res.tempFilePath)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '保存成功'
            })
          },
          fail(err) {
            console.log(err)
            if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
              wx.showModal({
                title: '提示',
                content: '需要您授权保存相册',
                showCancel: false,
                success: modalSuccess => {
                  wx.openSetting({
                    success(settingdata) {
                      console.log("settingdata", settingdata)
                      if (settingdata.authSetting['scope.writePhotosAlbum']) {
                        wx.showModal({
                          title: '提示',
                          content: '获取权限成功,再次点击保存到相册即可保存',
                          showCancel: false,
                        })
                      } else {
                        wx.showModal({
                          title: '提示',
                          content: '获取权限失败，将无法保存到相册哦~',
                          showCancel: false,
                        })
                      }
                    },
                    fail(failData) {
                      console.log("failData", failData)
                    },
                    complete(finishData) {
                      console.log("finishData", finishData)
                    }
                  })
                }
              })
            }
          }
        })
      }
    })
  }


})