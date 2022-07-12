/* 
  环境变量配置封装
*/
// 开发模式
const env = import.meta.env.MODE || "prod"
const EnvConfig = {
  // 开发环境
  development: {
    baseApi: "/api",
    mockApi:
      "https://www.fastmock.site/mock/9e8b4ab6c0ddae5023b6cea974dec117/api",
  },
  // 测试环境
  test: {
    baseApi: "//test/futurefe.com/api",
    mockApi:
      "https://www.fastmock.site/mock/9e8b4ab6c0ddae5023b6cea974dec117/api",
  },
  // 生产环境
  production: {
    baseApi: "//futurefe.com/api",
    mockApi:
      "https://www.fastmock.site/mock/9e8b4ab6c0ddae5023b6cea974dec117/api",
  },
}
export default {
  // 命名空间
  namespace: "manager",
  env,
  // 全部访问mock地址
  mock: false,
  ...EnvConfig[env],
}
