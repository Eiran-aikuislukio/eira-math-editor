import React from 'react'
import styled from '@emotion/styled'
import { Text } from '@chakra-ui/react'

import { formatDate } from '../utils/date'
import logo from '../assets/logo/logo.png'
import watermark from '../assets/logo/watermark.png'

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
`

const LogoImg = styled.img`
  width: 180px;
  height: auto;
`

const WatermarkImg = styled.img`
  position: absolute;
  top: 0;
  right: 0;
  width: 90px;
  height: auto;
`

const URL = process.env.REACT_APP_URL?.replace(/^https?:\/\//, '') || ''

const PdfHeader = () => (
  <Container>
    <LogoImg src={logo} />

    <div>
      <Text fontSize="sm">{formatDate(Date.now())}</Text>
      <Text fontSize="sm">{URL}</Text>
    </div>

    <WatermarkImg src={watermark} />
  </Container>
)

export default PdfHeader
