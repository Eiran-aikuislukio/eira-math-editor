import ReactDOM from 'react-dom'
import React from 'react'
import { saveAs } from 'file-saver'
import { jsPDF } from 'jspdf'
import { Providers } from '../App'
import { Heading } from '@chakra-ui/react'
import html2canvas from 'html2canvas'

import { Answer } from '../components/Editor'
import logo from '../assets/logo/logo.png'
import watermark from '../assets/logo/watermark.png'
import t from '../i18n'
import { formatDate } from './date'

export const DOWNLOAD_FILENAME = 'eira-math-editor'

const isDefaultTitle = (title) => title === t('NEW_ANSWER')

const url = process.env.REACT_APP_URL?.replace(/^https?:\/\//, '') || ''

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
const renderAnswersForDownload = (answers) => {
  const container = document.getElementById('download-container')

  ReactDOM.render(
    <Providers>
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

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        container,
        onComplete: () => ReactDOM.unmountComponentAtNode(container),
      })
    }, 500)
  })
}

const createAnswersCanvas = async (...answers) => {
  const { container, onComplete } = await renderAnswersForDownload(answers)

  const canvas = await html2canvas(container, {
    height: container.clientHeight,
    scale: 2,
    allowTaint: true,
  })

  onComplete()

  return canvas
}

const downloadImage = async (answer) => {
  const canvas = await createAnswersCanvas(answer)

  saveAs(canvas.toDataURL(), `${DOWNLOAD_FILENAME}.png`)
}

const drawHeader = (doc) => {
  const date = formatDate(Date.now())

  doc.setFontSize(10)
  doc.addImage(logo, 'PNG', 5, 5, 50, 50 / 2.86)
  doc.addImage(watermark, 'PNG', 176, 2, 25, 25)
  doc.text(170, 10, date)
  doc.text(170, 15, url)
}

const downloadPdf = async (answerCanvas) => {
  const doc = new jsPDF()
  const imageData = answerCanvas.toDataURL('image/png')
  const width = Math.floor(doc.internal.pageSize.getWidth())
  const pageHeight = Math.floor(doc.internal.pageSize.getHeight())
  const totalHeight = (answerCanvas.height * width) / answerCanvas.width
  const startingY = 30

  drawHeader(doc)

  // Split long images to download as a multi-page PDF
  for (let imageY = startingY; imageY > -totalHeight; imageY -= pageHeight) {
    // Add a new page if this isn't the first page
    if (imageY !== startingY) {
      doc.addPage()
    }

    doc.addImage(imageData, 'PNG', 0, imageY, width, totalHeight, '', 'FAST')
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

export const combineAndDownloadPdf = async (answers) => {
  const canvas = await createAnswersCanvas(...answers)

  downloadPdf(canvas)
}

export const TYPE = {
  FILE: 'FILE',
  PDF: 'PDF',
  IMAGE: 'IMAGE',
}

export const handleDownload = async (type, answer) => {
  switch (type) {
    case TYPE.FILE:
      downloadFile(answer)
      break

    case TYPE.PDF:
      const canvas = await createAnswersCanvas(answer)

      downloadPdf(canvas)
      break

    case TYPE.IMAGE:
      downloadImage(answer)
      break

    default:
    // No default
  }
}
