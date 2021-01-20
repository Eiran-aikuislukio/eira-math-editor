import React from 'react'
import PropTypes from 'prop-types'
import { DeleteIcon, DownloadIcon } from '@chakra-ui/icons'
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
import { handleDownload, TYPE } from '../utils/download'

const formatDate = (timestamp) =>
  new Date(timestamp).toLocaleDateString('fi', {
    hour: '2-digit',
    minute: '2-digit',
  })

const DownloadButton = ({ onDownload }) => (
  <Menu>
    <MenuButton
      as={IconButton}
      title={t('DOWNLOAD')}
      aria-label={t('DOWNLOAD')}
      icon={<DownloadIcon />}
      borderRadius="200px"
    />
    <MenuList>
      <MenuItem onClick={() => onDownload(TYPE.FILE)}>
        {t('DOWNLOAD_FILE')}
      </MenuItem>
      <MenuItem onClick={() => onDownload(TYPE.IMAGE)}>
        {t('SAVE_IMAGE')}
      </MenuItem>
      <MenuItem onClick={() => onDownload(TYPE.PDF)}>{t('SAVE_PDF')}</MenuItem>
    </MenuList>
  </Menu>
)

const DeleteButton = ({ onDelete }) => {
  const initialFocusRef = React.useRef()

  return (
    <Popover initialFocusRef={initialFocusRef}>
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
                  <Button ref={initialFocusRef} onClick={onDelete}>
                    {t('DELETE')}
                  </Button>
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
}

const MOTION = {
  INITIAL: { opacity: 0 },
  VISIBLE: { opacity: 1 },
}

const AnswerCard = ({ answer, onDelete, onClick }) => (
  <Box
    as={motion.li}
    layout
    bgColor="rgba(255, 255, 255, 0.5)"
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
          width="100%"
          isTruncated
        >
          {answer.title || t('NEW_ANSWER')}
        </Heading>

        <Heading as="p" size="xs" fontWeight="medium" width="100%" isTruncated>
          {formatDate(answer.date)}
        </Heading>
      </Button>
      <ButtonGroup spacing="0" variant="ghost">
        <DownloadButton onDownload={(type) => handleDownload(type, answer)} />
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
