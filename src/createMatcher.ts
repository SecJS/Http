// TODO Move to @secjs/utils
export function createMatcher(url: string): RegExp {
  const urlArray = url.split('/')

  urlArray.forEach((u, i) => {
    if (u === '') return
    if (u.startsWith(':')) {
      urlArray[i] = `(?:\\/[\\w]+)`

      return
    }

    urlArray[i] = `(?:\\/${u}\\b)`
  })

  url = urlArray.join('')

  return new RegExp(`^${url}$`)
}
