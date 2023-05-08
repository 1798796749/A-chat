import nprogress from 'nprogress'

export function showFullLoading() {
  nprogress.start()
}

export function hideFullLoading() {
  nprogress.done()
}
