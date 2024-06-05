# Express App With MongoDB

## MongoDB

### Transactions

项目使用 Mongoose 内置 Transactions 来执行事务以保证数据一致性。详见，[Mongoose Transactions](https://mongoosejs.com/docs/transactions.html)。

参考：https://www.jianshu.com/p/70ffd70fde84

Transactions 的核心思想就是使用同一个 session 来分发多个数据操作，如果其中一个发生错误，那么就撤回，并重置为 session 缓存的久数据。

## 环境变量

默认程序启动时为 development，若要修改对应环境，则需要在 `scripts` 脚本中设置环境变量。

除去 NODE*ENV 之外的自定义环境变量，均需要以 `EXPRESS_APP*`开头，例如:`EXPRESS_APP_DEV = 'some str'`。

默认使用 `dotenv` 加载环境变量，且需要在程序启动时，优先加载。

## 项目依赖

- node:crypto 用于生成 uuid

- bcrypt 用于对密码进行加密

- jsonwebtoken 根据私钥生成 token
