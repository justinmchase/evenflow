import Flow from './flow'
export default function evenflow (components, flow, callback) {
  let instance = new Flow(components, flow)
  instance.start(callback)
}
