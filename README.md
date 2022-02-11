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

> To use the high potential from this package you need to install first this other packages from SecJS,
> it keeps as dev dependency because one day `@secjs/core` will install everything once.

```bash
npm install @secjs/ioc @secjs/env @secjs/utils @secjs/exceptions
```

> Then you can install the package using:

```bash
npm install @secjs/http
```

## Usage

### Http

> Use Http class to create the http server and map all your routes

```ts
import { Http, ContextContract } from '@secjs/http'

const server = new Http()

// Middleware
server.use((ctx: ContextContract) => ctx.data.param = 'param')

server.get('/', ({ response }) => {
  response
    .status(200)
    .send({ hello: 'world!', param: ctx.data.param })
})

server.listen(1335, () => console.log('Server running!'))
```

---

### Router

> Use Router class to map all the groups, resources and normal routes of the application

```ts
import { TestController } from './TestController'
import { TestMiddleware } from './TestMiddleware'

import { Http, Router, ContextContract } from '@secjs/http'

// With router class you can map your routes inside groups and create resources

const http = new Http() // First you need to create the Http server
const Route = new Router(http)

// Create a route group to set the API version as prefix
Route.group(() => {
  Route.get('posts', (ctx: ContextContract) => {
    ctx.response.status(200).send({
      hello: 'world',
      userId: ctx.data.userId,
      postId: ctx.data.postId
    })
  })
    .middleware((ctx: ContextContract) => {
      ctx.data.postId = 1

      ctx.next()
    })

  // You can create a Resource route to create all the Http methods (index, store, show, update and delete)
  Route.resource('tests', new TestController()).except(['show']) // You can use except to create all minus show method
})
  .prefix('/api/v1')
  // You can how many middlewares you want using builder pattern, .middleware, .middleware, .middleware ....
  .middleware((ctx: ContextContract) => {
    ctx.data.userId = 1

    ctx.next()
  })

// You can also use middlewares 

// You need to call register method in the end to register all the routes in the Http server
Route.register()
http.listen()
```

> Registering routes like this could be a little difficult, so you can use the global Container from @secjs/ioc to register 
> controllers and middlewares in the container

```ts
import '@secjs/ioc/src/utils/global' // Will load the class Container in global runtime and in TS types

Container.singleton(TestController, 'TestController')
Container.singleton(
  // Named middlewares
  { 
    // Is extremelly important that middleware implement MiddlewareContract from @secjs/http
    'test.auth': new TestMiddleware(), 
    'test.hello': new TestMiddleware() 
  },
  'Middlewares',
)

// Now you can start using string names in routes

Route.group(() => {
  Route.resource('posts', 'TestController').only(['index', 'store']).middleware('test.auth')
})
  .prefix('/api/v2')
  .middleware('test.hello')

Route.register()
http.listen()
```

### Creating a Middleware

> With Http you can define three different execution times for one middleware

```ts
import { 
  Router,
  MiddlewareContract,
  HandleContextContract,
  InterceptContextContract,
  TerminateContextContract 
} from '@secjs/http'

export class Middleware implements MiddlewareContract {
  // Handle method will be executed before the controller method handler
  // This is the normal middleware
  async handle(ctx: HandleContextContract) {
    ctx.data.userId = '1'

    ctx.next()
  }

  // Intercept method will be executed before the response goes to client
  async intercept(ctx: InterceptContextContract) {
    // You can use intercept to rewrite or add some information to the response
    ctx.body.intercepted = true
    ctx.response.status(304)

    ctx.next()
  }

  // Terminate method will be executed after the response goes to client
  async terminate(ctx: TerminateContextContract) {
    // You can use terminate to save metrics of the request in an Elastic for example
    console.log('Terminate middleware executed!')

    ctx.next()
  }
}
```

> Now we can use Router to set the middleware in some route

```ts
Container.singleton(
  {
    'middleware': new Middleware(),
  },
  'Middlewares',
)

// If you use named middlewares in Router, he will register all the three methods of Middleware class.
Route.get('middlewares', 'TestController.index').middleware('middleware')

// But you can instantiate the middleware and will register all the three methods
Route
  // You can use controller method to set the default controller of Router
  .controller(new TestController())
  .get('middlewares', 'index')
  .middleware(new Middleware())

// Or you can set only the method and as second parameter the middleware type
Route
  .get('middlewares', new TestController().index)
  .middleware(new Middleware().intercept, 'intercept')
```

---

## License

Made with 🖤 by [jlenon7](https://github.com/jlenon7) :wave:
