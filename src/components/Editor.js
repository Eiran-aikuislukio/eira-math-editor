/*global MathJax, makeRichText*/

import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import useAnswersStore from '../store/answers'
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import t from '../i18n'
import { EditIcon } from '@chakra-ui/icons'

const Container = styled.div`
  width: 100%;
  height: 100%;
  min-height: 400px;
  display: flex;
  padding: 0;
  flex-direction: column;

  padding: 16px;
`

const Answer = styled.div`
  padding: 5px;
  flex: 1;
  font: 17px times new roman;
  background-color: #fff;
  position: relative;

  &.rich-text-editor-button[data-command]:hover:after,
  &.rich-text-editor-button-action[data-command]:hover:after {
    padding: 15px;
  }

  &.rich-text-editor img[src^='data:image/svg+xml'] {
    vertical-align: middle;
    margin: 4px;
    padding: 3px 10px;
    cursor: pointer;
    border: 1px solid transparent;
  }

  &.rich-text-editor.rich-text-focused img[src^='data:image/svg+xml'],
  &.rich-text-editor:focus img[src^='data:image/svg+xml'] {
    background: #edf9ff;
    border: 1px solid #e6f2f8;
  }

  &.rich-text-editor img[src*='data:image/png'] {
    margin: 4px;
  }

  &.rich-text-editor:focus img[src*='data:image/png'],
  &.rich-text-editor.rich-text-focused img[src*='data:image/png'] {
    box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.2);
  }
`

const Result = styled.div`
  display: none;
`

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

const encodeMultibyteUnicodeCharactersWithEntities = (str) =>
  str.replace(/[^\x00-\xFF]/g, (c) => `&#${c.charCodeAt(0).toString(10)};`)

const transformMath = (math, callback, svgNodes) => {
  if (svgNodes.length) {
    svgNodes.forEach((node) => {
      node.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

      node.querySelectorAll('use').forEach((useNode) => {
        if (useNode.outerHTML.indexOf('xmlns:xlink') === -1) {
          useNode.setAttribute(
            'xmlns:xlink',
            'http://www.w3.org/1999/xlink' // Add for safari
          )
        }
      })

      let svgHtml = node.outerHTML

      svgHtml = svgHtml.replace(' xlink=', ' xmlns:xlink=') // Firefox fix
      svgHtml = svgHtml.replace(/ ns\d+:href/gi, ' xlink:href') // Safari xlink ns issue fix

      callback(
        'data:image/svg+xml;base64,' +
          window.btoa(encodeMultibyteUnicodeCharactersWithEntities(svgHtml))
      )
    })
  } else {
    callback(
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
}

const onUpdateAnswer = (answer) => {
  const selectedAnswerId = useAnswersStore.getState().selectedAnswerId
  const updateAnswer = useAnswersStore.getState().updateAnswer

  updateAnswer(selectedAnswerId, answer)
}

const initRichTextEditor = (answerNode, resultNode) => {
  makeRichText(
    answerNode,
    {
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
    },
    onUpdateAnswer
  )

  const updateMath = function (latex, callback) {
    const math = MathJax.Hub.getAllJax('MathOutput')[0]

    MathJax.Hub.queue.Push(['Text', math, '\\displaystyle{' + latex + '}'])

    MathJax.Hub.Queue(() =>
      transformMath(math, callback, resultNode.querySelectorAll('svg'))
    )
  }
}

const Editor = ({ answer, selectedAnswerId }) => {
  const updateAnswer = useAnswersStore((state) => state.updateAnswer)

  const answerRef = useRef()
  const resultRef = useRef()
  const previousSelectedAnswerId = useRef(null)

  useEffect(() => {
    if (previousSelectedAnswerId.current === selectedAnswerId) {
      return
    }

    answerRef.current.innerHTML = answer?.answerHTML ?? ''
    answerRef.current.dispatchEvent(new Event('input'))

    // On first render initialize the rich text editor
    if (previousSelectedAnswerId.current === null) {
      initRichTextEditor(answerRef.current, resultRef.current)
    }

    previousSelectedAnswerId.current = selectedAnswerId
  }, [answer, selectedAnswerId])

  const handleChangeTitle = (event) =>
    updateAnswer(selectedAnswerId, { title: event.target.value })

  return (
    <Container>
      <InputGroup mb={5}>
        <InputLeftElement
          top="calc(50% - 1.25rem)"
          fontSize="1.5rem"
          children={<EditIcon color="gray.300" />}
        />
        <Input
          fontSize={40}
          fontWeight="bold"
          value={answer.title || ''}
          onChange={handleChangeTitle}
          variant="unstyled"
          placeholder={t('TITLE')}
        />
      </InputGroup>

      <Answer className="answer" id="answer" ref={answerRef} />
      {/* Render \({}\) to inform MathJax where to render the result*/}
      <Result ref={resultRef}>{'\\({}\\)'}</Result>
    </Container>
  )
}

Editor.propTypes = {
  answer: PropTypes.shape().isRequired,
  selectedAnswerId: PropTypes.string.isRequired,
}

export default Editor
