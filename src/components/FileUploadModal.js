import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Alert,
  AlertIcon,
  Button,
  ButtonGroup,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import { DownloadIcon } from '@chakra-ui/icons'

import t from '../i18n'
import { css } from '@emotion/react'

const focusLabelStyles = ({ theme }) => css`
  transition: box-shadow 0.1s;
  box-shadow: ${theme.shadows.outline};
`

const HiddenInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  width: 100%;
  z-index: 1;

  ~ label {
    ${({ isDraggingFile }) => isDraggingFile && focusLabelStyles};
  }

  &:focus ~ label {
    ${focusLabelStyles};
  }
`

const UploadBoxWrapper = styled.div`
  position: relative;
  min-height: 250px;
`

const StyledUploadBox = styled(Stack)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.blue['100']};
`

const getUploadLabel = (file) => {
  if (!file) {
    return (
      <>
        {t('CHOOSE_A_FILE')}{' '}
        <Text as="span" fontWeight="normal">
          {t('OR_DRAG_IT_HERE')}
        </Text>
      </>
    )
  }

  return file.name
}

const isValid = (fileContent) => typeof fileContent?.answerHTML === 'string'

const STATUS = {
  WAITING: 'WAITING',
  LOADING: 'LOADING',
  ERROR: 'ERROR',
  READY: 'READY',
  DRAGGING_FILE: 'DRAGGING_FILE',
}

const FileUploadModal = ({ isOpen, onClose, onSubmit }) => {
  const [file, setFile] = useState(null)
  const [fileContent, setFileContent] = useState(null)
  const [status, setStatus] = useState(STATUS.WAITING)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    if (!file) {
      setFileContent(null)

      return
    }

    const reader = new FileReader()

    setStatus(STATUS.LOADING)

    reader.addEventListener('load', (e) => {
      try {
        const fileContent = JSON.parse(reader.result)
        const isFileValid = isValid(fileContent)

        setFileContent(fileContent)
        setStatus(isFileValid ? STATUS.READY : STATUS.ERROR)
        setMessage(
          isFileValid
            ? { status: 'success', text: t('FILE_UPLOAD_SUCCESS') }
            : { status: 'error', text: t('INVALID_FILE') }
        )
      } catch (error) {
        setFileContent(null)
        setStatus(STATUS.ERROR)
        setMessage({ status: 'error', text: t('INVALID_FILE_FORMAT') })
      }
    })

    reader.readAsText(file)
  }, [file])

  const reset = () => {
    setFile(null)
    setFileContent(null)
    setStatus(STATUS.WAITING)
    setMessage(null)
  }

  const handleSubmit = () => {
    reset()
    onSubmit(fileContent)
  }

  const handleCancel = () => {
    reset()
    onClose()
  }

  const handleChangeFile = (e) => setFile(e.target.files[0])
  const handleDragOver = () => setStatus(STATUS.DRAGGING_FILE)
  const handleDragOut = () => setStatus(STATUS.WAITING)

  return (
    <Modal onClose={handleCancel} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('OPEN_FILE')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody as={Stack} spacing={2}>
          {!!message && (
            <Alert status={message?.status}>
              <AlertIcon />
              {message?.text}
            </Alert>
          )}

          <UploadBoxWrapper>
            <HiddenInput
              id="file-upload"
              type="file"
              isDraggingFile={status === STATUS.DRAGGING_FILE}
              onChange={handleChangeFile}
              onDragEnter={handleDragOver}
              onDragLeave={handleDragOut}
              onDragEnd={handleDragOut}
              onDrop={handleDragOut}
            />

            <StyledUploadBox as="label" htmlFor="file-upload" spacing={6}>
              <DownloadIcon w={8} h={8} />
              <Heading as="h1" size="md" textAlign="center">
                {getUploadLabel(file)}
              </Heading>
              <Text textAlign="center">{t('CHOOSE_A_FILE_INSTRUCTIONS')}</Text>
            </StyledUploadBox>
          </UploadBoxWrapper>
        </ModalBody>

        <ModalFooter>
          <ButtonGroup>
            <Button variant="ghost" onClick={handleCancel}>
              {t('CANCEL')}
            </Button>
            <Button
              disabled={!isValid(fileContent)}
              isLoading={status === STATUS.LOADING}
              onClick={handleSubmit}
            >
              {t('OPEN_FILE')}
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

FileUploadModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default FileUploadModal
