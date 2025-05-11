const fs = require('fs');
const path = require('path');
module.exports = {
  /**
   * 统一支付回调地址，格式为 "服务空间SpaceID":"URL化完整地址"
   * 这里的本地开发并不是指 http://localhost:8080/ 的地址，而是另外一个服务空间的ULR化地址（如果你本地开发和线上环境共用同一个服务空间则只需要填线上环境的即可）
   * 回调的云函数地址，建议填 /http/vk-pay，因为vk-pay云函数已经写好了回调处理的逻辑，否则你需要自己写全部的回调逻辑。
   * 其中vk-pay是可以改名的，只需要修改 uniCloud/cloudfunctions/vk-pay/package.json 文件中的 "path": "/http/vk-pay", 把 /http/vk-pay 改成 /http/xxxx 即可(需要重新上传云函数vk-pay)。
   */
  "notifyUrl": {
    // 本地开发环境，如果你本地开发和线上环境共用同一个服务空间则只需要填线上环境的即可
    "a4f90532-ac60-4a43-81c1-a5c4s3fbs66": "https://a4f90532-ac60-4a43-81c1-a5c4s3fbs66.bspapp.com/http/vk-pay",
    // 线上正式环境
    "b5a9s861-ba20-dca5-56a2-bd3fbsasxz6": "https://b5a9s861-ba20-dca5-56a2-bd3fbsasxz6.bspapp.com/http/vk-pay"
  },
  /**
   * 微信
   * 公共参数说明
   * appId   微信后台的appId
   * secret  微信后台的secret
   * mchId   微信支付的商户id
   * key     微信支付的api密钥（V2版本）
   * pfx     微信支付的p12证书（退款需要）
   */
  "wxpay": {
    // 微信 - 小程序支付（微信支付申请JSAPI支付）
    "mp-weixin": {
      "appId": "",
      "secret": "",
      "mchId": "",
      "key": "",
      "pfx": fs.readFileSync(__dirname + '/wxpay/wxpay.p12')
    },
    // 微信 - APP支付（微信支付申请APP支付）
    "app-plus": {
      "appId": "",
      "secret": "",
      "mchId": "",
      "key": "",
      "pfx": fs.readFileSync(__dirname + '/wxpay/wxpay.p12')
    },
    // 微信 - H5电脑网站二维码支付（微信支付申请Native支付）
    "h5": {
      "appId": "",
      "secret": "",
      "mchId": "",
      "key": "",
      "pfx": fs.readFileSync(__dirname + '/wxpay/wxpay.p12')
    },
    // 微信 - 公众号支付（微信支付申请JSAPI支付）
    "h5-weixin": {
      "appId": "",
      "secret": "",
      "mchId": "",
      "key": "",
      "pfx": fs.readFileSync(__dirname + '/wxpay/wxpay.p12')
    },
    // 微信 - 手机外部浏览器H5支付（微信支付申请H5支付）
    "mweb": {
      "appId": "",
      "secret": "",
      "mchId": "",
      "key": "",
      "pfx": fs.readFileSync(__dirname + '/wxpay/wxpay.p12'),
      // 场景信息，必填
      "sceneInfo": {
        "h5_info": {
          "type": "Wap", // 此值固定Wap
          "wap_url": "https://www.xxxxxx.com", // 你的H5首页地址，必须和你发起支付的页面的域名一致。
          "wap_name": "网站名称", // 你的H5网站名称
        }
      }
    }
  },
  /**
   * 支付宝（证书记得选java版本）
   * 公共参数说明
   * mchId                  支付宝商户id 2088开头的那个（此参数可以去除）
   * appId                  支付宝开放平台的应用appId
   * secret                 支付宝开放平台的应用secret
   * privateKey             应用私钥
   * alipayPublicCertPath   支付宝公钥证书路径地址  与之对应的 alipayPublicCertContent 为支付宝公钥证书内容（值可以是字符串也可以是Buffer）
   * alipayRootCertPath     支付宝根证书路径地址   与之对应的 alipayRootCertContent 为支付宝根证书内容（值可以是字符串也可以是Buffer）
   * appCertPath            应用证书路径地址      与之对应的 appCertPathContent 为应用证书内容（值可以是字符串也可以是Buffer）
   * sandbox  是否沙箱模式 true 沙箱模式 false 正常模式
   */
  "alipay": {
    // 支付宝 - 小程序支付配置
    "mp-alipay": {
      "mchId": "",
      "appId": "",
      "privateKey": "",
      "alipayPublicCertPath": path.join(__dirname, 'alipay/alipayCertPublicKey_RSA2.crt'),
      "alipayRootCertPath": path.join(__dirname, 'alipay/alipayRootCert.crt'),
      "appCertPath": path.join(__dirname, 'alipay/appCertPublicKey.crt'),
      "sandbox": false
    },
    // 支付宝 - APP支付配置
    "app-plus": {
      "mchId": "",
      "appId": "",
      "privateKey": "",
      "alipayPublicCertPath": path.join(__dirname, 'alipay/alipayCertPublicKey_RSA2.crt'),
      "alipayRootCertPath": path.join(__dirname, 'alipay/alipayRootCert.crt'),
      "appCertPath": path.join(__dirname, 'alipay/appCertPublicKey.crt'),
      "sandbox": false
    },
    // 支付宝 - H5支付配置（包含：网站二维码、手机H5，需申请支付宝当面付接口权限）
    "h5": {
      "mchId": "",
      "appId": "",
      "privateKey": "",
      "alipayPublicCertPath": path.join(__dirname, 'alipay/alipayCertPublicKey_RSA2.crt'),
      "alipayRootCertPath": path.join(__dirname, 'alipay/alipayRootCert.crt'),
      "appCertPath": path.join(__dirname, 'alipay/appCertPublicKey.crt'),
      "sandbox": false
    },
    // 支付宝 - 转账到支付宝等资金转出接口，其中 appCertSn 和 alipayRootCertSn 通过工具获取
    "transfer": {
      "mchId": "",
      "appId": "",
      "privateKey": "",
      "appCertSn": "", // 应用证书的序列号
      "alipayRootCertSn": "", // 支付宝根证书的序列号
      "sandbox": false
    }
  }
}
