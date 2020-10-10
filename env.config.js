/**
 * 声明环境配置对象，对不同的环境进行配置
 * {isMock} 是否是本地json模拟数据，前端开发前期可能用到
 * {apiPrefix} 请求地址前缀
 * {serverHost} 服务器域名
 * {uploadUrlPrefix} 上传图片地址前缀
 * {timeout} 请求超时时间
 */

const envConfig = {
  // 本地模拟数据
  local: {
    isMock: true,
    apiPrefix: '/test/',
    serverHost: 'http://localhost:8856',
    defaultLoginPage: '/Login/admin',
    enableDeskopPlugin: true
  },
  // 调用后台api开发
  dev: {
    isMock: false,
    apiPrefix: '/plat/',
    // apiPrefix:'/',
    uploadUrlPrefix: '/plat',
    //apiPrefix: '/',
    //uploadUrlPrefix: '',
    //serverHost: 'http://139.159.230.154:8086',
    //serverHost: "http://139.159.191.204:8086",
    //serverHost: "http://localhost",
    timeout: 300000,
    defaultLoginPage: '/Login/admin',
    title: '基础平台',
    enableDeskopPlugin: true
  },
  // 生产环境
  pro: {
    // isMock: false,
    // apiPrefix: '/api/plat/',
    // uploadUrlPrefix: '/api/plat',
    // //serverHost: "http://139.159.230.154:8086", // 正式域名
    // //serverHost: "http://192.168.31.203:8088", // 正式域名
    // serverHost: "http://192.168.51.100:20002", // 正式域名
    // timeout: 300000,
    // defaultLoginPage: '/Login/admin',
    // title: '基础平台',
    // enableDeskopPlugin: false

    isMock: false,
    apiPrefix: '/plat/',
    uploadUrlPrefix: '/plat',
    //serverHost: "https://jywq.gyfc.net.cn",
    //serverHost: 'http://139.159.230.154:8086',
    // serverHost: "http://139.159.191.204:8086",
    //serverHost: "http://192.168.51.78:20061",
    //serverHost: "http://localhost",
    timeout: 300000,
    defaultLoginPage: '/Login/admin',
    title: '基础平台',
    enableDeskopPlugin: true
  }
};

// 根据环境变量自动切换
const env =
  process.env.NODE_ENV === 'production' ? envConfig.pro : envConfig.dev;
export default env;
