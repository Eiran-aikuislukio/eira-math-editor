import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { css, Global } from '@emotion/react'

import Layout from './components/Layout'
import theme from './theme'

const globalStyles = css`
  body {
    margin: 0;
  }
`

const App = () => (
  <ChakraProvider theme={theme}>
    <Global styles={globalStyles} />
    <Layout />
  </ChakraProvider>
)

export default App
