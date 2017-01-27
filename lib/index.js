import Flow from './flow'
export default function create (components, flow, callback) {
  let instance = new Flow(components, flow)
  instance.start(callback)
}
