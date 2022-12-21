import { Launch, Colors, Registry } from '@lightningjs/sdk'
import App from './App.js'

//## 🍕 Docs Visited
//##  https://lightningjs.io/docs/
//##  https://lightningjs.io/examples/
//##  https://rdkcentral.github.io/Lightning-UI-Components/
//##  https://forum.lightningjs.io/t/the-ultimate-guide-to-lightning-issues/231
//##  https://github.com/mlapps/ui-component-examples

export default function () {
  const options = {
    stage: {
      w: window.innerWidth,
      h: window.innerHeight,
      clearColor: Colors('#231942').get(),
    },
  }
  return Launch(App, options, ...arguments)
}

const target = document.body
const event = 'resize'
const handler = (event) => {
  console.log(event)
}

Registry.addEventListener(target, event, handler)
