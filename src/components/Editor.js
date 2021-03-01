/* global MathJax, makeRichText */
/* eslint-disable no-control-regex */

import React, { forwardRef, useEffect, useRef } from 'react'
import debounce from 'lodash/debounce'
import styled from '@emotion/styled'
import useAnswersStore from '../store/answers'
import {
  Box,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  useToast,
} from '@chakra-ui/react'
import t from '../i18n'
import { CopyIcon, EditIcon } from '@chakra-ui/icons'

const ERROR_SVG_BASE_64 = window.btoa(`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
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

const EditorBox = forwardRef((props, ref) => (
  <Box ref={ref} textStyle="editor" {...props} />
))

const AnswerWrapper = styled.div`
  display: flex;
  position: relative;
  flex: 1 0 auto;
`

const CopyToClipboard = styled(IconButton)`
  position: absolute;
  z-index: 3;
  top: 8px;
  right: 8px;
`

export const Answer = styled(EditorBox)`
  padding: 20px;
  flex: 1;
  background-color: #fff;
  position: relative;

  img[src*='/math.svg'],
  img[src^='data:image/svg+xml'] {
    display: inline-block;
    vertical-align: middle;
    margin: 4px;
    padding: 3px 10px;
    cursor: pointer;
    border: 1px solid transparent;
  }

  img[src$='/math.svg?latex='],
  img[src=''] {
    display: none;
  }

  &:focus img[src*='/math.svg'],
  &.rich-text-focused img[src*='/math.svg'],
  &:focus img[src^='data:image/svg+xml'],
  &.rich-text-focused img[src^='data:image/svg+xml'] {
    background: #edf9ff;
    border: 1px solid #e6f2f8;
  }

  img[src*='data:image/png'] {
    margin: 4px;
  }

  &:focus img[src*='data:image/png'],
  &.rich-text-focused img[src*='data:image/png'] {
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

const transformMath = (callback, svgNodes) => {
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
        `data:image/svg+xml;base64,${window.btoa(
          encodeMultibyteUnicodeCharactersWithEntities(svgHtml)
        )}`
      )
    })
  } else {
    callback(`data:image/svg+xml;base64,${ERROR_SVG_BASE_64}`)
  }
}

const trim = (latex) => (latex.replace(/(\\|\s)*/g, '') === '' ? '' : latex)

const setServerSideSvg = ($img, latex) => {
  const trimmedLatex = trim(latex)

  $img.prop({
    src: `/math.svg?latex=${encodeURIComponent(trimmedLatex)}`,
    alt: trimmedLatex,
  })

  $img.closest('[data-js="answer"]').trigger('input')
}

const updateClientSideMath = function (latex, callback, resultNode) {
  const math = MathJax.Hub.getAllJax('MathOutput')[0]

  MathJax.Hub.queue.Push(['Text', math, '\\displaystyle{' + latex + '}'])

  MathJax.Hub.Queue(() =>
    transformMath(callback, resultNode.querySelectorAll('svg'))
  )
}

const setClientSideSvg = ($img, latex, resultNode) => {
  updateClientSideMath(
    latex,
    (svg) => {
      $img.prop({ src: svg, alt: latex })
      $img.closest('[data-js="answer"]').trigger('input')
    },
    resultNode
  )
}

const onUpdateAnswer = debounce((answer) => {
  const selectedAnswerId = useAnswersStore.getState().selectedAnswerId
  const updateAnswer = useAnswersStore.getState().updateAnswer

  updateAnswer(selectedAnswerId, answer)
}, 800)

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
      baseUrl: process.env.REACT_APP_URL,
      updateMathImg($img, latex) {
        if (process.env.REACT_APP_SVG_RENDERING === 'server') {
          setServerSideSvg($img, latex)
        } else {
          setClientSideSvg($img, latex, resultNode)
        }
      },
    },
    onUpdateAnswer
  )
}

const TOAST_OPTIONS = {
  position: 'top',
  duration: 9000,
  isClosable: true,
}

const Editor = () => {
  const answers = useAnswersStore((state) => state.answers)
  const selectedAnswerId = useAnswersStore((state) => state.selectedAnswerId)
  const updateAnswer = useAnswersStore((state) => state.updateAnswer)
  const toast = useToast()

  const answerRef = useRef()
  const resultRef = useRef()
  const previousSelectedAnswerId = useRef(null)

  const answer = answers.find(({ id }) => id === selectedAnswerId)

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

  const handleCopyToClipboard = () => {
    try {
      answerRef.current.focus()
      document.execCommand('selectAll')
      document.execCommand('copy')
      getSelection().empty()

      toast({
        title: t('COPIED_TO_CLIPBOARD'),
        status: 'success',
        ...TOAST_OPTIONS,
      })
    } catch (error) {
      toast({
        title: t('FAILED_TO_COPY_TO_CLIPBOARD'),
        status: 'error',
        ...TOAST_OPTIONS,
      })
    }
  }

  return (
    <>
      <InputGroup mb={5} flexShrink="0">
        <InputLeftElement
          top="calc(50% - 1.25rem)"
          fontSize="1.5rem"
          children={<EditIcon color="gray.300" />}
        />
        <Input
          key={answer.title}
          fontSize={40}
          fontWeight="bold"
          defaultValue={answer.title || ''}
          onBlur={handleChangeTitle}
          variant="unstyled"
          placeholder={t('TITLE')}
        />
      </InputGroup>

      <AnswerWrapper>
        <CopyToClipboard
          onClick={handleCopyToClipboard}
          aria-label={t('COPY_TO_CLIPBOARD')}
          icon={<CopyIcon />}
        />
        <Answer ref={answerRef} />
      </AnswerWrapper>

      {/* Render \({}\) to inform MathJax where to render the result */}
      <Result ref={resultRef}>{'\\({}\\)'}</Result>
    </>
  )
}

export default Editor
