// TODO Move to @secjs/utils
export function getParams(url: string): string[] {
  return url.split('/').reduce((results, route) => {
    if (route.match(':')) {
      results.push(route.includes('|') ? route.split('|')[0] : route)
    }

    return results
  }, [])
}
