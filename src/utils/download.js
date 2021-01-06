import ReactDOM from 'react-dom'
import React from 'react'
import { saveAs } from 'file-saver'
import { jsPDF } from 'jspdf'
import { Providers } from '../App'
import { Heading } from '@chakra-ui/react'
import { Answer } from '../components/Editor'
import html2canvas from 'html2canvas'

import t from '../i18n'

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
 * html2canvas requires that the element to be converted is on the page, so we must
 * render the answer to the DOM. Return a promise to ensure equation images have been
 * rendered before we calculate the container height.
 *
 * @param {Answer} answer
 * @returns {Promise<{container: HTMLElement, onComplete: () => void}>}
 */
const renderAnswerForDownload = (answer) => {
  const container = document.getElementById('download-container')

  ReactDOM.render(
    <Providers>
      {!isDefaultTitle(answer.title) && (
        <Heading size="lg" m={4}>
          {answer.title}
        </Heading>
      )}

      <Answer dangerouslySetInnerHTML={{ __html: answer.answerHTML }} />
    </Providers>,
    container
  )

  return new Promise((resolve) => {
    resolve({
      container,
      onComplete: () => ReactDOM.unmountComponentAtNode(container),
    })
  })
}

const renderAnswerToCanvas = async (answer) => {
  const { container, onComplete } = await renderAnswerForDownload(answer)

  const canvas = await html2canvas(container, {
    height: container.clientHeight,
    scale: 2,
  })

  onComplete()

  return canvas
}

const downloadImage = async (answer) => {
  const canvas = await renderAnswerToCanvas(answer)

  saveAs(canvas.toDataURL(), `${DOWNLOAD_FILENAME}.png`)
}

const downloadPdf = async (answer) => {
  const doc = new jsPDF()
  const canvas = await renderAnswerToCanvas(answer)
  const imageData = canvas.toDataURL('image/png')
  const width = Math.floor(doc.internal.pageSize.getWidth())
  const pageHeight = Math.floor(doc.internal.pageSize.getHeight())
  const imageHeight = (canvas.height * width) / canvas.width

  let imageHeightRemaining = imageHeight
  let position = 10

  doc.addImage(imageData, 'PNG', 0, position, width, imageHeight, '', 'FAST')
  imageHeightRemaining -= pageHeight

  while (imageHeightRemaining >= 0) {
    position += imageHeightRemaining - imageHeight
    doc.addPage()
    doc.addImage(imageData, 'PNG', 0, position, width, imageHeight, '', 'FAST')
    imageHeightRemaining -= pageHeight
  }

  doc.save(`${DOWNLOAD_FILENAME}.pdf`)
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

export const handleDownload = (type, answer) => {
  switch (type) {
    case TYPE.FILE:
      downloadFile(answer)
      break
    case TYPE.PDF:
      downloadPdf(answer)
      break
    case TYPE.IMAGE:
      downloadImage(answer)
      break
    default:
    // No default
  }
}
