import ReactDOM from 'react-dom'
import React from 'react'
import { saveAs } from 'file-saver'
import castArray from 'lodash/castArray'
import { Providers } from '../App'
import { Heading } from '@chakra-ui/react'
import html2canvas from 'html2canvas'
import html2pdf from 'html2pdf.js'

import { Answer } from '../components/Editor'
import t from '../i18n'
import PdfHeader from '../components/PdfHeader'

export const DOWNLOAD_FILENAME = 'eira-math-editor'

const isDefaultTitle = (title) => title === t('NEW_ANSWER')

/**
 * An Answer
 * @typedef {Object} Answer
 * @property {string} id - Unique ID of the answer
 * @property {string} title - Title of the
 * @property {string} answerHTML - HTML of the answer
 * @property {number} date - Unix timestamp of when the answer was crated
 */

/**
 * Returns a promise that resolves once all images in a container have loaded
 *
 * @param {HTMLElement} container
 * @returns {Promise<undefined>}
 */
const waitForImagesToLoad = (container) =>
  new Promise((resolve) => {
    let imagesLoaded = 0
    const images = container.querySelectorAll('img')

    if (images.length === 0) {
      resolve()
    }

    const onImageLoaded = () => {
      imagesLoaded++

      if (imagesLoaded === images.length) {
        resolve()
      }
    }

    images.forEach((image) => {
      if (image.complete) {
        onImageLoaded()
      } else {
        image.addEventListener('load', onImageLoaded)
        image.addEventListener('error', onImageLoaded)
      }
    })
  })

/**
 * html2canvas requires that the element to be converted is on the page, so we must
 * render the answer to the DOM. Return a promise to ensure equation images have been
 * rendered before we calculate the container height.
 *
 * @param {Answer} answer
 * @returns {Promise<{container: HTMLElement, onComplete: () => void}>}
 */
const renderAnswersForDownload = async (answers, withHeader) => {
  const container = document.getElementById('download-container')

  answers = castArray(answers)

  ReactDOM.render(
    <Providers>
      {withHeader && <PdfHeader />}
      {answers.map((answer) => (
        <div key={answer.id}>
          {!isDefaultTitle(answer.title) && (
            <Heading size="lg" m={4}>
              {answer.title}
            </Heading>
          )}

          <Answer dangerouslySetInnerHTML={{ __html: answer.answerHTML }} />
        </div>
      ))}
    </Providers>,
    container
  )

  await waitForImagesToLoad(container)

  return {
    container,
    onComplete: () => ReactDOM.unmountComponentAtNode(container),
  }
}

const downloadImage = async (answer) => {
  const { container, onComplete } = await renderAnswersForDownload(
    answer,
    false
  )

  await waitForImagesToLoad(container)

  const canvas = await html2canvas(container, {
    height: container.clientHeight,
    scale: 1.4,
    allowTaint: true,
  })

  saveAs(canvas.toDataURL(), `${DOWNLOAD_FILENAME}.png`)
  onComplete()
}

export const downloadPdf = async (answers) => {
  const { container, onComplete } = await renderAnswersForDownload(
    answers,
    true
  )

  const options = {
    margin: [16, 8],
    filename: `${DOWNLOAD_FILENAME}.pdf`,
    html2canvas: {
      scale: 1.4,
      allowTaint: true,
    },
    pagebreak: { mode: 'avoid-all' },
  }

  await html2pdf().set(options).from(container).save()

  onComplete()
}

const downloadFile = (answer) => {
  const fileName = `${DOWNLOAD_FILENAME}.json`

  const fileToSave = new Blob([JSON.stringify(answer)], {
    type: 'application/json',
    name: fileName,
  })

  saveAs(fileToSave, fileName)
}

export const TYPE = {
  FILE: 'FILE',
  PDF: 'PDF',
  IMAGE: 'IMAGE',
}

export const handleDownload = async (type, answer) => {
  switch (type) {
    case TYPE.FILE:
      await downloadFile(answer)
      break

    case TYPE.PDF:
      await downloadPdf(answer)
      break

    case TYPE.IMAGE:
      await downloadImage(answer)
      break

    default:
    // No default
  }
}
