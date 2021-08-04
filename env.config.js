/**
 * 声明环境配置对象，对不同的环境进行配置
 * {isMock} 是否是本地json模拟数据，前端开发前期可能用到
 * {apiPrefix} 请求地址前缀
 * {timeout} 请求超时时间
 */
const envConfig = {
  // 调用后台api开发
  dev: {
    thisApiPrefix: 'http://192.168.51.78:8146',
    basicApiPrefix: '/api'
  },
  //测试环境
  test: {
    thisApiPrefix: 'http://rems.ktwlrj.com:20061/dgsystem/',
    basicApiPrefix: 'http://rems.ktwlrj.com:20061/api/'
    // thisApiPrefix: 'http://192.168.51.78:20061/dgsystem/',
    // basicApiPrefix: 'http://192.168.51.78:20061/api/'
  },
  // 生产环境
  pro: {
    thisApiPrefix: 'https://spfwq.gyfc.net.cn/api/dgsystem/',
    basicApiPrefix: 'https://spfwq.gyfc.net.cn/api/',
  },
}
let env = null
if (process.env.NODE_ENV == 'development') {
  env = envConfig.dev
} else if (
  process.env.NODE_ENV == 'production' &&
  process.env.VUE_APP_MODE == 'test'
) {
  //测试环境
  env = envConfig.test
} else {
  env = envConfig.pro
}

console.log(process.env)

export default env
