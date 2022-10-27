// using Colors cuz my VS is bugging the color display
import { Colors, Utils } from '@lightningjs/sdk'

//#########################################################
//##  Config Settings 😈
//#########################################################
/* eslint-disable no-undef */
const settings = {
  shapes: {
    width: 300,
    height: 350,
    border: false,
    gap: 60,
    colors: ['#763ffc', '#480ca8'],
  },
  slider: {
    width: 900,
    height: 350,
    x: window.innerWidth / 2 - 450,
    y: window.innerHeight / 2 - 175,
  },
}

//#########################################################
//##  Default Component - AKA (SLIDER)
//##  https://lightningjs.io/examples/#/advanced/slider
//#########################################################

export default class App extends lng.Component {
  static getFonts() {
    return [
      {
        family: 'Roboto',
        url: Utils.asset('static/fonts/Roboto-Regular.ttf'),
        descriptor: {},
      },
    ]
  }

  static _template() {
    return {
      Slider: {
        w: settings.slider.width,
        h: settings.slider.height,
        x: settings.slider.x,
        y: settings.slider.y,
        Wrapper: {},
      },
    }
  }

  _init() {
    // Defining shapes components object
    const shapes = {
      Star,
      Ellipse,
      Pentagon,
    }
    // Getting the keys
    const sKeys = Object.keys(shapes)

    // Loooping & Keys events Setup
    this.index = 0
    this.dataLength = sKeys.length
    const slides = []
    for (let i = 0; i < this.dataLength; i++) {
      slides.push({
        // Pushing new content to the Slider
        type: shapes[sKeys[i]],
        w: settings.shapes.width,
        h: settings.shapes.height,
        rect: true,
        x: i * (settings.shapes.width + settings.shapes.gap) - settings.shapes.gap,
        color: Colors(settings.shapes.colors[0]).get(),
        Shape: {
          // Rendering the canvas from the draw method from each shape component
          // https://lightningjs.io/docs/#/lightning-core-reference/RenderEngine/Textures/Canvas?id=live-demo 🙄
          texture: lng.Tools.getCanvasTexture(shapes[sKeys[i]].draw),
        },
        Label: {
          x: 10,
          y: 315,
          color: 0xffffffff,
          text: {
            text: sKeys[i],
            fontSize: 20,
            fontFace: 'Roboto',
          },
        },
      })
    }
    // Append to the Slider
    this.tag('Wrapper').children = slides
  }

  _handleLeft() {
    if (this.index === 0) {
      this.index = this.dataLength - 1
    } else {
      this.index -= 1
    }
  }

  _handleRight() {
    if (this.index === this.dataLength - 1) {
      this.index = 0
    } else {
      this.index += 1
    }
  }

  _getFocused() {
    return this.tag('Slider.Wrapper').children[this.index]
  }
}

//#########################################################
//##  Component - AKA (⭐ Star)
//#########################################################

class Star extends lng.Component {
  _init() {
    // Animations Setup - Rotating
    // https://lightningjs.io/docs/#/lightning-core-reference/Animations/ActionValue?id=smoothing
    this._rotate = this.tag('Shape').animation({
      duration: 1,
      repeat: -1,
      stopMethod: 'immediate',
      actions: [
        {
          p: 'rotation',
          v: {
            sm: 0,
            0: 0,
            1: (360 * Math.PI) / 180,
          },
        },
      ],
    })
  }

  _focus() {
    this.patch({
      smooth: {
        color: Colors(settings.shapes.colors[1]).get(),
        scale: 1.1,
      },
      Label: {
        text: 'Star (Focus)',
      },
    })
    this._rotate.start()
  }

  _unfocus() {
    this.patch({
      smooth: {
        color: Colors(settings.shapes.colors[0]).get(),
        scale: 1.0,
      },
      Label: {
        text: 'Star',
      },
    })
    //this._rotate.pause() didn't like the output of the focus so decided to just return it to the original position
    this._rotate.stop()
  }

  // Draw method 🙄
  // https://lightningjs.io/docs/#/lightning-core-reference/RenderEngine/Textures/Canvas?id=live-demo
  static draw(cb, stage) {
    let canvas = stage.platform.getDrawingCanvas()
    let canvasCtx = canvas.getContext('2d')

    canvas.width = settings.shapes.width
    canvas.height = settings.shapes.height

    let XY = [settings.shapes.width / 2, settings.shapes.height / 2]

    let alpha = (2 * Math.PI) / 10
    let radius = 75

    // Generating Star ⭐
    // https://stackoverflow.com/questions/14580033/algorithm-for-drawing-a-5-point-star
    canvasCtx.beginPath()

    for (let i = 11; i != 0; i--) {
      let r = (radius * ((i % 2) + 1)) / 2
      let omega = alpha * i
      canvasCtx.lineTo(r * Math.sin(omega) + XY[0], r * Math.cos(omega) + XY[1])
    }

    canvasCtx.closePath()
    canvasCtx.fillStyle = '#e9c46a'
    canvasCtx.fill()

    cb(null, canvas)
  }
}

//#########################################################
//##  Component - AKA (⭕ Ellipse)
//#########################################################

class Ellipse extends lng.Component {
  _init() {
    // Animations Setup - Alpha
    // https://lightningjs.io/docs/#/lightning-core-reference/Animations/ActionValue?id=action-value
    this._alpha = this.tag('Shape').animation({
      duration: 3,
      repeat: 0,
      actions: [
        {
          p: 'alpha',
          v: {
            0: 1,
            1: 0,
          },
        },
      ],
    })
  }

  _focus() {
    this.patch({
      smooth: {
        color: Colors(settings.shapes.colors[1]).get(),
        scale: 1.1,
      },
      Label: {
        text: 'Ellipse (Focus)',
      },
    })
    this._alpha.start()
  }

  _unfocus() {
    this.patch({
      smooth: {
        color: Colors(settings.shapes.colors[0]).get(),
        scale: 1.0,
      },
      Label: {
        text: 'Ellipse',
      },
    })

    this._alpha.stop()
  }

  // Draw method 🙄
  // https://lightningjs.io/docs/#/lightning-core-reference/RenderEngine/Textures/Canvas?id=live-demo
  static draw(cb, stage) {
    let canvas = stage.platform.getDrawingCanvas()
    let canvasCtx = canvas.getContext('2d')

    canvas.width = settings.shapes.width
    canvas.height = settings.shapes.height

    let XY = [settings.shapes.width / 2, settings.shapes.height / 2]

    let rx = 60
    let ry = 75

    // Generating Ellipse ⭕
    // https://stackoverflow.com/questions/2172798/how-to-draw-an-oval-in-html5-canvas

    canvasCtx.save()
    canvasCtx.beginPath()

    canvasCtx.translate(XY[0] - rx, XY[1] - ry)
    canvasCtx.scale(rx, ry)
    canvasCtx.arc(1, 1, 1, 0, 2 * Math.PI, false)

    canvasCtx.restore()
    canvasCtx.fillStyle = '#ff87ab'
    canvasCtx.fill()

    cb(null, canvas)
  }
}

//#########################################################
//##  Component - AKA (🔶 Pentagon)
//#########################################################

class Pentagon extends lng.Component {
  _init() {
    // Animations Setup's - Zooms
    // I could use just the zoomIn and play it and stop it at the toggle but when I spam the ENTER/RETURN it gets buggy 😒
    // https://lightningjs.io/docs/#/lightning-core-reference/Animations/index?id=live-demo
    this._zoomIn = this.tag('Shape').animation({
      duration: 3,
      repeat: 0,
      actions: [
        {
          p: 'scale',
          v: {
            0: 1,
            1: 2,
          },
        },
      ],
    })
    this._zoomOut = this.tag('Shape').animation({
      duration: 3,
      repeat: 0,
      actions: [
        {
          p: 'scale',
          v: {
            0: 2,
            1: 1,
          },
        },
      ],
    })
  }

  // https://lightningjs.io/docs/#/lightning-core-reference/Components/CompStates/NestingStates?id=live-demo
  // Organizing the states
  static _states() {
    return [
      class zoomIn extends this {
        $enter() {
          this._zoomIn.play()
        }
        $exit() {
          this._zoomIn.stop()
        }
      },
      class zoomOut extends this {
        $enter() {
          this._zoomOut.play()
        }
        $exit() {
          this._zoomOut.stop()
        }
      },
    ]
  }

  _focus() {
    // Changing the border config and generate a new Pentagon 🔶 shape with border
    settings.shapes.border = true
    this.patch({
      smooth: {
        color: Colors(settings.shapes.colors[1]).get(),
        scale: 1.1,
      },
      Shape: {
        texture: lng.Tools.getCanvasTexture(Pentagon.draw),
      },
      Label: {
        text: 'Pentagon (Focus)',
      },
    })
  }

  _unfocus() {
    // Changing the border config and generate a new Pentagon 🔶 shape without border
    settings.shapes.border = false
    this.patch({
      smooth: {
        color: Colors(settings.shapes.colors[0]).get(),
        scale: 1.0,
      },
      Shape: {
        // eslint-disable-next-line no-undef
        texture: lng.Tools.getCanvasTexture(Pentagon.draw),
      },
      Label: {
        text: 'Pentagon',
      },
    })
  }

  _handleEnter() {
    this.toggle = !this.toggle

    this.patch({
      Label: {
        text: 'Pentagon (Enter/Return)',
      },
    })
    // On toggle change state
    if (this.toggle) {
      this._setState('zoomIn')
    } else {
      this._setState('zoomOut')
    }
  }

  // Draw method 🙄
  // https://lightningjs.io/docs/#/lightning-core-reference/RenderEngine/Textures/Canvas?id=live-demo
  static draw(cb, stage) {
    let canvas = stage.platform.getDrawingCanvas()
    let canvasCtx = canvas.getContext('2d')

    canvas.width = settings.shapes.width
    canvas.height = settings.shapes.height

    let XY = [settings.shapes.width / 2, settings.shapes.height / 2]

    let numberOfSides = 5
    let size = 75
    let step = (2 * Math.PI) / numberOfSides
    let shift = (Math.PI / 180.0) * -18

    // Generating Pentagon 🔶
    // https://stackoverflow.com/questions/36529781/how-to-draw-a-simple-pentagon-in-canvas

    canvasCtx.beginPath()

    for (let i = 0; i <= numberOfSides; i++) {
      let curStep = i * step + shift
      canvasCtx.lineTo(XY[0] + size * Math.cos(curStep), XY[1] + size * Math.sin(curStep))
    }

    // On focus add border
    if (settings.shapes.border) {
      canvasCtx.strokeStyle = '#000000'
      canvasCtx.lineWidth = 2
      canvasCtx.stroke()
    }

    canvasCtx.fillStyle = '#5390d9'
    canvasCtx.fill()

    cb(null, canvas)
  }
}
