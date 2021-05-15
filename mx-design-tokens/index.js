import core from './tokens/core'
import backgroundColor from './tokens/backgroundColor'
import borderColor from './tokens/borderColor'
import borderRadius from './tokens/borderRadius'
import boxShadow from './tokens/boxShadow'
import letterSpacing from './tokens/letterSpacing'
import fontSize from './tokens/fontSize'
import spacing from './tokens/spacing'
import textColor from './tokens/textColor'

export const targets = {
  REACT: 'react',
  REACT_NATIVE: 'react_native',
  NATIVE: 'native',
}

export const buildTheme = (themeName, target=targets.REACT, customColors={}, customFonts={}) => {
  const customCore = {
    ...core,
    Color: {
      ...core.Color,
      ...customColors,
    },
    Font: {
      ...core.Font,
      ...customFonts,
    }
  }

  const builtCore = {}

  Object.keys(customCore).forEach(coreKey => {
    const value = typeof customCore[coreKey] === 'function' ?
      customCore[coreKey](target) :
      customCore[coreKey]

    builtCore[coreKey] = value
  })


  return {
    ...builtCore,
    BackgroundColor: backgroundColor[themeName](builtCore),
    BorderColor: borderColor[themeName](builtCore),
    BorderRadius: {
      ...core.BorderRadius,
      ...borderRadius[themeName](builtCore),
    },
    BoxShadow: {
      ...core.BoxShadow,
      ...boxShadow[themeName](builtCore),
    },
    LetterSpacing: letterSpacing[themeName](builtCore),
    FontSize: {
      ...core.FontSize,
      ...fontSize[themeName](builtCore),
    },
    Spacing: {
      ...core.Spacing,
      ...spacing[themeName](builtCore),
    },
    TextColor: textColor[themeName](builtCore),
  }
}

export const light = buildTheme('light')

export const dark = buildTheme('dark')
