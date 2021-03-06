import colors from './Colors';

// see appdelegate for ios font debugging
export const fonts = {
  EXTRA_BOLD: {
    fontFamily: 'NunitoSans-ExtraBold'
  },
  BOLD: {
    fontFamily: 'NunitoSans-Bold'
  },
  REGULAR: {
    fontFamily: 'NunitoSans-Regular'
  },
  LIGHT: {
    fontFamily: 'NunitoSans-Light'
  },
  ITALIC: {
    fontFamily: 'NunitoSans-Italic'
  },
  EXTRA_LIGHT: {
    fontFamily: 'NunitoSans-ExtraLight'
  },
  EXTRA_LIGHT_ITALIC: {
    fontFamily: 'NunitoSans-ExtraLightItalic'
  },
  LIGHT_ITALIC: {
    fontFamily: 'NunitoSans-LightItalic'
  }
};

export const fontSystem = {
  TITLE: {
    ...fonts.EXTRA_BOLD,
    color: colors.BLACK,
    fontSize: 24
  },
  SUBTITLE: {
    ...fonts.LIGHT_ITALIC,
    color: colors.DARK_GRAY,
    fontSize: 14
  },
  SUBTITLE_ITALICS: {
    ...fonts.ITALIC,
    color: colors.BLACK,
    fontSize: 16
  },
  H1: {
    ...fonts.REGULAR,
    color: colors.BLACK,
    fontSize: 24
  },
  H2: {
    ...fonts.BOLD,
    color: colors.BLACK,
    fontSize: 16
  },
  H3: {
    ...fonts.REGULAR,
    color: colors.BLACK,
    fontSize: 18
  },
  BODY_LARGE: {
    ...fonts.EXTRA_LIGHT,
    color: colors.BLACK,
    fontSize: 18
  },
  BODY: {
    ...fonts.EXTRA_LIGHT,
    color: colors.BLACK,
    fontSize: 14
  },
  BOLD_BODY: {
    ...fonts.BOLD,
    color: colors.BLACK,
    fontSize: 14
  },
  SECONDARY_BODY: {
    ...fonts.EXTRA_LIGHT,
    color: colors.DARK_GRAY,
    fontSize: 14
  },
  NAME: {
    ...fonts.EXTRA_LIGHT_ITALIC,
    color: colors.BLACK,
    fontSize: 12
  },
  DATE_TIMEAGO: {
    ...fonts.ITALIC,
    color: colors.LIGHT_GRAY,
    fontSize: 12
  },
  ICON_NUMBER_INACTIVE: {
    ...fonts.LIGHT,
    color: colors.BLACK,
    fontSize: 16
  },
  ICON_NUMBER_ACTIVE: {
    ...fonts.BOLD,
    color: colors.YELLOW,
    fontSize: 16
  }
};
