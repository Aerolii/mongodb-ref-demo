const dotenv = require('dotenv')

// 定义规则：EXPRESS_APP_ 开头的环境变量会被注入前端
// process.env.EXPRESS_APP
const EXPRESS_APP = /^EXPRESS_APP_/i

// 也可以忽略
function getClientEnvironment(publicUrl) {
  console.log(Object.keys(process.env).filter((key) => EXPRESS_APP.test(key)))
  // 取所有的环境变量，然后过滤出以EXPRESS_APP_开头的环境变量
  // 返回一个环境变量配置对象
  const raw = Object.keys(process.env)
    .filter((key) => EXPRESS_APP.test(key))
    .reduce(
      (env, key) => {
        console.log('env :>> ', env)
        console.log('key :>> ', key)
        env[key] = process.env[key]
        return env
      },
      {
        // 再合并一些自定义的前端环境变量
        NODE_ENV: process.env.NODE_ENV || 'development'
        // PUBLIC_URL: publicUrl
      }
    )

  // 字符串形式的process.env  提供给webpack DefinePlugin使用
  // 可以将前端代码中的process.env.XXX替换为对应的实际环境变量值
  // const stringified = {
  //   'process.env': Object.keys(raw).reduce((env, key) => {
  //     env[key] = JSON.stringify(raw[key])
  //     return env
  //   }, {})
  // }

  return raw
}

function read(env) {
  const path = process.cwd()

  if (env === 'production') {
    dotenv.config({ path: `${path}/.env.production` })
  }

  if (env === 'development') {
    dotenv.config({ path: `${path}/.env.development` })
  }
  dotenv.config({ path: `${path}/.env` })

  return getClientEnvironment()
}

module.exports = read
