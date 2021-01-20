import { extendTheme } from '@chakra-ui/react'

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
    600: '#3A82CF',
  },

  black: 'rgb(29, 29, 29)',

  white: '#fff',

  grey: {
    600: '#d5d2ca',
  },

  blue: {
    600: '#00a9e0',
  },

  green: {
    600: '#72ce9b',
  },

  peach: {
    600: '#e78f77',
  },

  yellow: {
    600: '#fcd450',
  },

  lilac: {
    600: '#9093ce',
  },
}

const fonts = {
  body: 'omnes-pro, system-ui, sans-serif',
  heading: 'omnes-pro, system-ui, sans-serif',
  editor: '"Times New Roman", serif',
}

const fontWeights = {
  normal: 400,
  medium: 500,
  bold: 600,
}

const textStyles = {
  editor: {
    fontFamily: 'editor',
    fontSize: 'lg',
  },
}

export default extendTheme({ colors, fonts, fontWeights, textStyles })
