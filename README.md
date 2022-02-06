# Http 📶

> Simple http server for any NodeJS Project

[![GitHub followers](https://img.shields.io/github/followers/jlenon7.svg?style=social&label=Follow&maxAge=2592000)](https://github.com/jlenon7?tab=followers)
[![GitHub stars](https://img.shields.io/github/stars/secjs/http.svg?style=social&label=Star&maxAge=2592000)](https://github.com/secjs/http/stargazers/)

<p>
    <a href="https://www.buymeacoffee.com/secjs" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>
</p>

<p>
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/secjs/http?style=for-the-badge&logo=appveyor">

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/secjs/http?style=for-the-badge&logo=appveyor">

  <img alt="License" src="https://img.shields.io/badge/license-MIT-brightgreen?style=for-the-badge&logo=appveyor">

  <img alt="Commitizen" src="https://img.shields.io/badge/commitizen-friendly-brightgreen?style=for-the-badge&logo=appveyor">
</p>

The intention behind this repository is to always maintain a `Http` package to any NodeJS project.

<img src=".github/http.png" width="200px" align="right" hspace="30px" vspace="100px">

## Installation

```bash
npm install @secjs/http
```

## Usage

### Http

> Use Http class to create the http server and map all your routes

```ts
import { Http, ContextContract } from '@secjs/http'

const server = new Http()

server.use(ctx => ctx.data.param = 'param')

server.get('/', ({ response }) => {
  response
    .status(200)
    .send({ hello: 'world!', param: ctx.data.param })
})

server.listen(1335, () => console.log('Server running!'))
```

---

## License

Made with 🖤 by [jlenon7](https://github.com/jlenon7) :wave:
