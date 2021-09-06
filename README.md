# Http 📶

> Simple http server for any NodeJS Project

[![GitHub followers](https://img.shields.io/github/followers/jlenon7.svg?style=social&label=Follow&maxAge=2592000)](https://github.com/jlenon7?tab=followers)
[![GitHub stars](https://img.shields.io/github/stars/secjs/http.svg?style=social&label=Star&maxAge=2592000)](https://github.com/secjs/http/stargazers/)

<p>
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/secjs/http?style=for-the-badge&logo=appveyor">

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/secjs/http?style=for-the-badge&logo=appveyor">

  <img alt="License" src="https://img.shields.io/badge/license-MIT-brightgreen?style=for-the-badge&logo=appveyor">
</p>

The intention behind this repository is to always maintain a `Http` package to any NodeJS project.

<img src=".github/http.png" width="200px" align="right" hspace="30px" vspace="100px">

## WARN 🛑⚠️

> This project is under `development` do not use it until releases v1.0.0.

## Installation

```bash
yarn add @secjs/http
```

## Usage

### SecJS

> Use SecJS to create the Http server and map all your routes with handlers

```ts
import { SecJS } from '@secjs/http'
import { SecContextContract } from '@secjs/contracts'

const server = new SecJS()

server.get('/', (ctx: SecContextContract) => {
  ctx.response.status(200).json({ hello: 'world!' })
})

server.listen(4040, () => console.log('Server running!'))
```

---

## License

Made with 🖤 by [jlenon7](https://github.com/jlenon7) :wave:
