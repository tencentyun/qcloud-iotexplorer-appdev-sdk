const actions = require('../../redux/actions');
const { subscribeStore } = require('../../libs/store-subscribe');
const showWifiConfTypeMenu = require('../add-device/wifiConfTypeMenu');

Page({
  data: {
    deviceList: [],
    shareDeviceList: [],
    deviceStatusMap: {},
    inited: false,
  },

  onLoad() {
    this.unsubscribeAll = subscribeStore(
      [
        'deviceList',
        'shareDeviceList',
        'deviceStatusMap',
      ].map(key => {
        return {
          selector: (state) => state[key],
          onChange: (value) => this.setData({ [key]: value }),
        };
      })
    );
  },

  onUnload() {
    this.unsubscribeAll && this.unsubscribeAll();
  },

  onLoginReady() {
    this.getData();
  },

  onTapItem({ currentTarget: { dataset: { item } } }) {
    if (item.isShareDevice) {
      wx.navigateTo({
        url: `/pages/panel/panel?deviceId=${item.DeviceId}&isShareDevice=1`,
      });
    } else {
      wx.navigateTo({
        url: `/pages/panel/panel?deviceId=${item.DeviceId}`,
      });
    }
  },

  onPullDownRefresh() {
    this.getData();
  },

  getData() {
    actions.getDevicesData()
      .then(() => {
        if (!this.data.inited) {
          this.setData({ inited: true });
        }
        wx.stopPullDownRefresh();
      })
      .catch((err) => {
        if (!this.data.inited) {
          this.setData({ inited: true });
        }
        console.error('getDevicesData fail', err);
        wx.stopPullDownRefresh();
      });
  },

  showAddDeviceMenu() {
    showWifiConfTypeMenu();
  },
});
