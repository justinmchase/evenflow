import { exec } from 'child_process'

export default function (cmd, dir, callback) {
  let print = data => process.stdout.write(data)
  let opts = {
    cwd: dir
  }
  let child = exec(cmd, opts)
  child.stdout.on('data', print)
  child.stderr.on('data', print)
  child.on('close', (code) => {
    if (callback) callback(code)
  })
  return child
}
