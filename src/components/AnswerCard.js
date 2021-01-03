import React from 'react'
import PropTypes from 'prop-types'
import { DeleteIcon, DownloadIcon } from '@chakra-ui/icons'
import { saveAs } from 'file-saver'
import {
  Box,
  Button,
  ButtonGroup,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Text,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'

import t from '../i18n'

const formatDate = (timestamp) =>
  new Date(timestamp).toLocaleDateString('fi', {
    hour: '2-digit',
    minute: '2-digit',
  })

const DownloadButton = ({ onDownloadFile }) => (
  <Menu>
    <MenuButton
      as={IconButton}
      title={t('DOWNLOAD')}
      aria-label={t('DOWNLOAD')}
      icon={<DownloadIcon />}
      borderRadius="200px"
    />
    <MenuList>
      <MenuItem onClick={onDownloadFile}>Download file</MenuItem>
      <MenuItem onClick={() => console.log('IMAGE')}>Save image</MenuItem>
      <MenuItem onClick={() => console.log('PDF')}>Save PDF</MenuItem>
    </MenuList>
  </Menu>
)

const DeleteButton = ({ onDelete }) => (
  <Popover>
    {({ onClose }) => (
      <>
        <PopoverTrigger>
          <IconButton
            title={t('DELETE')}
            aria-label={t('DELETE')}
            icon={<DeleteIcon />}
            borderRadius="200px"
          />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>
            <Heading as="h4" size="sm">
              {t('CONFIRM_DELETE')}
            </Heading>
          </PopoverHeader>
          <PopoverBody>
            <Stack spacing={3}>
              <Text>{t('ARE_YOU_SURE_YOU_WANT_TO_DELETE')}</Text>
              <ButtonGroup marginLeft="auto">
                <Button onClick={onDelete}>{t('DELETE')}</Button>
                <Button variant="ghost" onClick={onClose}>
                  {t('CANCEL')}
                </Button>
              </ButtonGroup>
            </Stack>
          </PopoverBody>
        </PopoverContent>
      </>
    )}
  </Popover>
)

const MOTION = {
  INITIAL: { opacity: 0 },
  VISIBLE: { opacity: 1 },
}

const getFileName = (answer) => {
  return 'math-editor-download.json'
}

const handleDownload = (answer) => {
  const fileName = getFileName(answer)

  var fileToSave = new Blob([JSON.stringify(answer)], {
    type: 'application/json',
    name: fileName,
  })

  saveAs(fileToSave, fileName)
}

const AnswerCard = ({ answer, onDelete, onClick }) => (
  <Box
    as={motion.li}
    layout
    bgColor="peach.600"
    p={3}
    initial={MOTION.INITIAL}
    animate={MOTION.VISIBLE}
    exit={MOTION.INITIAL}
    listStyleType="none"
  >
    <Stack direction="row" justifyContent="space-between">
      <Button
        variant="unstyled"
        onClick={onClick}
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="center"
        flex="1"
        minWidth="0"
        textAlign="left"
      >
        <Heading
          title={answer.title || t('NEW_ANSWER')}
          as="p"
          size="sm"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          overflow="hidden"
        >
          {answer.title || t('NEW_ANSWER')}
        </Heading>

        <Heading as="p" size="xs" fontWeight="medium">
          {formatDate(answer.date)}
        </Heading>
      </Button>
      <ButtonGroup spacing="0" variant="ghost">
        <DownloadButton onDownloadFile={() => handleDownload(answer)} />
        <DeleteButton onDelete={onDelete} />
      </ButtonGroup>
    </Stack>
  </Box>
)

AnswerCard.propTypes = {
  answer: PropTypes.shape().isRequired,
  onDelete: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default AnswerCard
