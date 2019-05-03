import { StyleSheet } from 'react-native';
import { fonts } from '../../../styles/Fonts';
import colors from '../../../styles/Colors';

export default StyleSheet.create({
  box: {
    textAlign: 'left',
  },
  text: {
    ...fonts.REGULAR,
    color: colors.BLACK,
    fontSize: 18,
  },
});