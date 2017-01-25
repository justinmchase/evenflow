
export function get (path, value) {
  let steps = path.split('.')
  for (var i = 0, n = steps.length; i < n; i++) {
    let key = parseInt(steps[i]) || steps[i]
    value = value[key]
    if (value == null) break
  }
  return value
}

export function set (target, path, value) {
  if (!(typeof target === 'object')) {
    let err = new Error('Invalid target for set')
    err.target = target
    err.path = path
    err.value = value
    throw err
  }
  let steps = path.split('.')
  let key = null
  for (var i = 0, n = steps.length; i < n; i++) {
    key = parseInt(steps[i]) || steps[i]
    if (i === n - 1) target[key] = value
    else if (target[key] == null) target[key] = {}
    target = target[key]
  }
}

export function merge (into, value) {
  if (typeof into !== typeof value) throw new Error(`Unable to merge ${value} into ${into}`)

  Object.keys(value).forEach(property => {
    into[property] = value[property]
  })
}
