/*global MathJax, makeRichText, $*/

MathJax.Hub.Config({
  jax: ['input/TeX', 'output/SVG'],
  extensions: [
    'toMathML.js',
    'tex2jax.js',
    'MathMenu.js',
    'MathZoom.js',
    'fast-preview.js',
    'AssistiveMML.js',
    'a11y/accessibility-menu.js',
  ],
  TeX: {
    extensions: [
      'AMSmath.js',
      'AMSsymbols.js',
      'noErrors.js',
      'noUndefined.js',
      'mhchem.js',
    ],
  },
  SVG: {
    useFontCache: true,
    useGlobalCache: false,
    EqnChunk: 1000000,
    EqnDelay: 0,
    font: 'STIX-Web',
  },
})

const answer = document.querySelector('#answer')

makeRichText(answer, {
  screenshot: {
    saver: ({ data }) =>
      new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (evt) =>
          resolve(
            evt.target.result.replace(/^(data:image)(\/[^;]+)(;.*)/, '$1$3')
          )
        reader.readAsDataURL(data)
      }),
  },
  baseUrl: 'https://math-demo.abitti.fi',
  updateMathImg: ($img, latex) => {
    updateMath(latex, (svg) => {
      $img.prop({
        src: svg,
        alt: latex,
      })
      $img.closest('[data-js="answer"]').trigger('input')
    })
  },
})

let math = null

MathJax.Hub.queue.Push(() => {
  math = MathJax.Hub.getAllJax('MathOutput')[0]
})

const encodeMultibyteUnicodeCharactersWithEntities = (str) =>
  str.replace(/[^\x00-\xFF]/g, (c) => `&#${c.charCodeAt(0).toString(10)};`)

const updateMath = function (latex, cb) {
  MathJax.Hub.queue.Push(['Text', math, '\\displaystyle{' + latex + '}'])
  MathJax.Hub.Queue(() => {
    if ($('.result svg').length) {
      const $svg = $('.result svg').attr('xmlns', 'http://www.w3.org/2000/svg')
      $svg.find('use').each(function () {
        const $use = $(this)
        if ($use[0].outerHTML.indexOf('xmlns:xlink') === -1) {
          $use.attr('xmlns:xlink', 'http://www.w3.org/1999/xlink') //add these for safari
        }
      })
      let svgHtml = $svg.prop('outerHTML')
      //firefox fix
      svgHtml = svgHtml.replace(' xlink=', ' xmlns:xlink=')
      // Safari xlink ns issue fix
      svgHtml = svgHtml.replace(/ ns\d+:href/gi, ' xlink:href')
      cb(
        'data:image/svg+xml;base64,' +
          window.btoa(encodeMultibyteUnicodeCharactersWithEntities(svgHtml))
      )
    } else {
      cb(
        'data:image/svg+xml;base64,' +
          window.btoa(`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
  <svg width="17px" height="15px" viewBox="0 0 17 15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>Group 2</title>
    <defs></defs>
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-241.000000, -219.000000)">
            <g transform="translate(209.000000, 207.000000)">
                <rect x="-1.58632797e-14" y="0" width="80" height="40"></rect>
                <g transform="translate(32.000000, 12.000000)">
                    <polygon id="Combined-Shape" fill="#9B0000" fill-rule="nonzero" points="0 15 8.04006 0 16.08012 15"></polygon>
                    <polygon id="Combined-Shape-path" fill="#FFFFFF" points="7 11 9 11 9 13 7 13"></polygon>
                    <polygon id="Combined-Shape-path" fill="#FFFFFF" points="7 5 9 5 9 10 7 10"></polygon>
                </g>
            </g>
        </g>
    </g>
  </svg>`)
      )
    }
  })
}

let studentDisplay = null

MathJax.Hub.Queue(function () {
  studentDisplay = MathJax.Hub.getAllJax(document.querySelector('.result'))[0]
})

const trackError = (e = {}) => {
  const category = 'JavaScript error'
  const action = e.message
  const label = e.filename + ':' + e.lineno

  console.error(category, action, label)
}

if (window.addEventListener) {
  window.addEventListener('error', trackError, false)
} else if (window.attachEvent) {
  window.attachEvent('onerror', trackError)
} else {
  window.onerror = trackError
}
