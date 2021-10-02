/**
 * Typeset and convert LaTex to SVG
 *
 * Validation rules from https://github.com/digabi/rich-text-editor/blob/master/server/mathSvg.js
 */
const mathjax = require('mathjax-node')

const MAX_NESTING_LEVEL = 20
const MAX_LENGTH = 5000
const nestedContextStartedRegexes = ['\\left', '{', '\\begin']
const nestedContextEndingRegexes = ['\\right', '}', '\\end']
const ERROR_SVG = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
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
</svg>`

const isTooLong = (latex) => latex.length > MAX_LENGTH

const isTooDeep = (latex) => {
  let nestingLevel = 0
  const matches = latex.match(/\\right|\\left|\\begin|\\end|\{|\}/g)

  if (!matches) {
    return false
  }

  matches.forEach((match) => {
    if (
      nestedContextStartedRegexes.some(
        (startingRegex) => startingRegex === match
      )
    )
      nestingLevel++
    else if (
      nestedContextEndingRegexes.some((endingRegex) => endingRegex === match)
    )
      nestingLevel--
    if (nestingLevel > MAX_NESTING_LEVEL) return true
  })

  return false
}

const formatResponse = (body) => ({
  statusCode: 200,
  headers: {
    'Content-Type': 'image/svg+xml',
  },
  body,
})

mathjax.config({
  extensions: 'TeX/mhchem.js',
  MathJax: {
    SVG: {
      font: 'Latin-Modern',
    },
  },
})

exports.handler = async function (event) {
  const { latex } = event.queryStringParameters

  console.log(
    `REQUEST
      |- ${event.headers.referer}
      |- ${event.headers[process.env.HEADER_LOG_KEY]}
      |- LATEX: "${latex}"`
  )

  if (!latex || isTooLong(latex) || isTooDeep(latex)) {
    return formatResponse(ERROR_SVG)
  }

  const data = await mathjax.typeset({
    math: latex,
    format: 'TeX',
    mml: false,
    svg: true,
    linebreaks: true,
    width: 100,
  })

  if (data.errors) {
    console.log('Error', latex, JSON.stringify(data.errors))

    return formatResponse(ERROR_SVG)
  }

  return formatResponse(data.svg)
}
