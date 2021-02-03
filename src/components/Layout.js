import React from 'react'
import { HamburgerIcon, ArrowLeftIcon } from '@chakra-ui/icons'
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Grid,
  GridItem,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react'
import styled from '@emotion/styled'

import { ReactComponent as Logo } from '../assets/logo/logo.svg'
import useAnswersStore from '../store/answers'
import Editor from './Editor'
import t from '../i18n'
import Shortcuts from './Shortcuts'
import Footer from './Footer'
import Sidebar from './Sidebar'

const StyledLogo = styled(Logo)`
  height: 90px;
  max-width: 100%;
  max-height: 100%;
`

const Layout = () => {
  const addAnswer = useAnswersStore((state) => state.addAnswer)
  const deleteAnswer = useAnswersStore((state) => state.deleteAnswer)
  const selectAnswer = useAnswersStore((state) => state.selectAnswer)

  const {
    isOpen: isMenuOpen,
    onOpen: openMenu,
    onClose: closeMenu,
  } = useDisclosure()

  const { isOpen: isSidebarExpanded, onToggle: toggleSidebar } = useDisclosure({
    defaultIsOpen: true,
  })

  const handleAddAnswer = (answer) => {
    addAnswer(answer)
    closeMenu()
  }

  const handleClickAnswer = (answer) => {
    closeMenu()
    selectAnswer(answer.id)
  }

  const sidebarWidth = ['100%', null, isSidebarExpanded ? '300px' : '35px']

  const sidebar = (
    <Sidebar
      onAddAnswer={handleAddAnswer}
      onDeleteAnswer={deleteAnswer}
      onClickAnswer={handleClickAnswer}
    />
  )

  return (
    <>
      <Grid
        h="100vh"
        templateAreas={[
          `'header' 'editor' 'footer'`,
          null,
          `'header header' 'sidebar editor' 'footer editor'`,
        ]}
        templateColumns={['100%', null, 'min-content auto']}
        templateRows="max-content 1fr auto"
      >
        <GridItem
          gridArea="header"
          as="header"
          bg="gray.600"
          p={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <StyledLogo />
          <Shortcuts />
          <IconButton
            aria-label={t('OPEN_MENU')}
            variant="ghost"
            display={['block', null, 'none']}
            size="lg"
            icon={<HamburgerIcon boxSize={8} color="white" />}
            onClick={openMenu}
          />
        </GridItem>

        <GridItem
          display={['none', null, 'flex']}
          width={sidebarWidth}
          overflowX="hidden"
          transition="width 0.4s"
          gridArea="sidebar"
          bg="gray.500"
          p={4}
          alignItems="stretch"
          flexDirection="column"
        >
          <Flex
            direction="column"
            flex="1 0 auto"
            opacity={isSidebarExpanded ? '1' : '0'}
            transition={`opacity 0.2s ${isSidebarExpanded ? '0.2s' : '0s'}`}
          >
            {sidebar}
          </Flex>
        </GridItem>

        <GridItem
          display="flex"
          flexDirection="column"
          gridArea="editor"
          bg="gray.400"
          width="100%"
          overflowY="auto"
          p={[2, 4]}
        >
          <Editor />
        </GridItem>

        <GridItem
          position="relative"
          gridArea="footer"
          bg="gray.600"
          transition="width 0.4s"
          p={4}
          width={sidebarWidth}
        >
          <IconButton
            position="absolute"
            display={['none', null, 'flex']}
            top="-20px"
            zIndex="4"
            aria-label={t('TOGGLE_SIDEBAR')}
            isRound
            transform={isSidebarExpanded ? 'rotate(0deg)' : 'rotate(180deg)'}
            icon={<ArrowLeftIcon />}
            onClick={toggleSidebar}
          />

          <Box
            color="white"
            pt={[0, null, 6]}
            minWidth="240px" // Prevent wrapping when sidebar collapses
            visibility={isSidebarExpanded ? 'visible' : 'hidden'}
            opacity={[1, null, isSidebarExpanded ? '1' : '0']}
            transition={`opacity 0.2s ${isSidebarExpanded ? '0.2s' : '0s'}`}
          >
            <Footer />
          </Box>
        </GridItem>
      </Grid>

      <Drawer isOpen={isMenuOpen} placement="left" onClose={closeMenu}>
        <DrawerOverlay>
          <DrawerContent bg="gray.500" pt={14}>
            <DrawerCloseButton size="lg" color="white" />
            <DrawerBody
              display="flex"
              p={4}
              alignItems="stretch"
              flexDirection="column"
            >
              {sidebar}
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  )
}

export default Layout
