import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { css, Global } from '@emotion/react'
import styled from '@emotion/styled'

import Layout from './components/Layout'
import theme from './theme'

const globalStyles = css`
  body {
    margin: 0;
  }
`

const DownloadContainer = styled.div`
  position: absolute;
  z-index: -1000;
  top: 0;
  left: 0;
  width: 800px;
`

export const Providers = ({ children }) => (
  <ChakraProvider theme={theme}>
    <Global styles={globalStyles} />
    {children}
  </ChakraProvider>
)

const App = () => (
  <Providers>
    <Layout />
    <DownloadContainer id="download-container" />
  </Providers>
)

export default App
