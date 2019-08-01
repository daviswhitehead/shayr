import { StyleSheet } from 'react-native';

import colors from '../../styles/Colors';
import { fontSystem } from '../../styles/Fonts';
import Layout from '../../styles/Layout';

export default StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start'
  },
  scrollView: {
    flex: 1
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginHorizontal: Layout.SPACING_LONG
  },
  loadingContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.YELLOW
  },
  contentBox: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  sectionBox: {
    marginBottom: Layout.SPACING_LONG
  },
  sectionHeader: {
    ...fontSystem.H2,
    marginVertical: Layout.SPACING_MEDIUM
  },
  body: {
    ...fontSystem.BODY
  },
  boldBody: {
    ...fontSystem.BOLD_BODY,
    marginLeft: Layout.SPACING_SHORT
  },
  activityBox: {
    marginBottom: Layout.SPACING_LONG
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  }
});
