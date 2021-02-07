import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  ButtonGroup,
  Heading,
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

import t from '../i18n'

const ConfirmDelete = ({
  children,
  confirmMessage = t('ARE_YOU_SURE_YOU_WANT_TO_DELETE'),
  onConfirmDelete,
}) => {
  const initialFocusRef = React.useRef()

  return (
    <Popover initialFocusRef={initialFocusRef}>
      {({ onClose }) => (
        <>
          <PopoverTrigger>{children}</PopoverTrigger>

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
                <Text>{confirmMessage}</Text>
                <ButtonGroup marginLeft="auto">
                  <Button
                    ref={initialFocusRef}
                    onClick={onConfirmDelete}
                    data-testid="confirm-delete"
                  >
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

ConfirmDelete.propTypes = {
  children: PropTypes.node.isRequired,
  confirmMessage: PropTypes.string,
  onConfirmDelete: PropTypes.func.isRequired,
}

export default ConfirmDelete
