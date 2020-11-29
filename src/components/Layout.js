import { Grid, GridItem } from '@chakra-ui/react'
import styled from '@emotion/styled'
import React from 'react'

const StyledIframe = styled.iframe`
  width: 100%;
`

const Layout = () => {
  return (
    <Grid
      h="100vh"
      templateAreas="
        'header instructions'
        'sidebar instructions'
        'sidebar editor'
        'footer footer'"
      templateColumns="20% auto"
      templateRows="100px max-content auto 100px"
    >
      <GridItem gridArea="header" bg="brand.900" />
      <GridItem gridArea="sidebar" bg="brand.800" />
      <GridItem h={60} gridArea="instructions" bg="brand.700" />
      <GridItem
        display="flex"
        alignItems="stretch"
        justifyContent="stretch"
        gridArea="editor"
        bg="brand.600"
        p={4}
      >
        <StyledIframe title="editor" src="/editor/editor.html" />
      </GridItem>
      <GridItem gridArea="footer" bg="brand.900" />
    </Grid>
  )
}

export default Layout
