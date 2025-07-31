import { StyleSheet } from 'react-native';


export const colors = {
  primary: '#333',
  secondary: '#ccc',
  // accent: '#009990',
  // accent: '#654520',
  // accent: '#6DC5D1',
  // accent: '#197278',
  accent: '#283D3B',
  accent: '#009990',
  accent: 'black',

  // accent: '#614051',
  // accent: '#86608E',

  accentInvert: '#fff',
  accentInvert: '#000',

  // accentLight: 'lightgreen',
  accentLight: '#DCFFFD',
  // accentLight: '#C6DE41',

  accentServer: '#754E1A',

  // headerBgColor: '#009990',
  headerBgColor: '#197278',
  headerBgColor: '#283D3B',

  // userMsgBgColor: '#FFC145',
  // userMsgBgColor: '#333',
  // userMsgBgColor: '#DCF8C6',
  // userMsgBgColor: '#f5f5f5',
  userMsgBgColor: '#283D3B',
  // userMsgTextColor: '#333',
  // userMsgTextColor: '#ccc',
  userMsgTextColor: '#eee',

  // serverMsgBgColor: '#E3651D',
  // serverMsgBgColor: '#C6DE41',
  // serverMsgBgColor: '#ECECEC',
  // serverMsgBgColor: '#edddd4',
  serverMsgBgColor: '#e5c1ad',
  serverMsgTextColor: '#111',

  // chatInputBgColor: '#333',
  // chatInputBgColor: '#ccc',
  chatInputBgColor: '#fff',
  // placeholderTextColor: '#ccc',
  placeholderTextColor: '#333',

  // containerBgColor: '#333',
  // containerBgColor: '#000',
  // containerBgColor: 'wheat',
  // containerBgColor: 'lightgrey',
  containerBgColor: '#f5f5f5',
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.containerBgColor,
    justifyContent: 'center',
    padding: 0,
  },
  loginContainer: {
    paddingBottom: 20,
    margin: 'auto',
    width: '80%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    position: 'relative',
    overflow: 'hidden',
  },
  loginHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    height: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
  },
  loginForm: {
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  logoutButton: {
    marginLeft: 'auto',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.accent,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  moreBtn: {
    marginLeft: 'auto',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    color: colors.accentLight,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: colors.accent,
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.accent,
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  setupView: {
    padding: 20,
    margin: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  setupViewHeader: {
    marginBottom: 20,
  },
  setupViewTitles: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  setupViewInputs: {
    padding: 10,
    margin: 10,
    backgroundColor: '#fff',
    color: '#333',
    borderRadius: 10,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.headerBgColor,
    paddingHorizontal: 15,
    zIndex: 100,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#333',
    padding: 10,
    marginBottom: 10,
    borderRadius: 20,
    fontSize: 16,
  },
  chatContainer: {
    padding: 12,
    paddingBottom: 2,
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    // display: 'none',
  },
  messageBubble: {
    padding: 10,
    marginVertical: 5,
    maxWidth: '80%',
    position: 'relative', // To position the triangle
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.userMsgBgColor,
    borderRadius: 15,
    borderTopRightRadius: 0,
    // marginRight: 10, // To make the triangle visible
  },
  serverMessage: {
    alignSelf: 'flex-start',
    backgroundColor: colors.serverMsgBgColor,
    borderRadius: 15,
    borderTopLeftRadius: 0,
    // marginLeft: 10, // To make the triangle visible
  },
  userMsgText: {
    fontSize: 16,
    color: colors.userMsgTextColor,
  },
  serverMsgText: {
    fontSize: 16,
    color: colors.serverMsgTextColor,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  textInput: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: colors.chatInputBgColor,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: colors.accent,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  userMessageTriangle: {
    position: 'absolute',
    top: '0%',
    right: -10,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderLeftColor: colors.userMsgBgColor,
    borderBottomWidth: 10,
    borderBottomColor: 'transparent',
    display: 'none',
  },
  serverMessageTriangle: {
    position: 'absolute',
    top: '0%',
    left: -10,
    width: 0,
    height: 0,
    borderRightWidth: 10,
    borderRightColor: colors.serverMsgBgColor,
    borderBottomWidth: 10,
    borderBottomColor: 'transparent',
    display: 'none',
  },
  inOneLine: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  fancyTitleWrapper: {
    // padding: 20,
    borderRadius: 10,
    // marginBottom: 20,
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // right: 0,
    height: 200,
    justifyContent: 'center',
  },
  fancyTitle: {
    fontSize: 40,
    color: '#fff',
    // fontFamily: 'Montserrat_Bold',
    fontFamily: 'Playwrite_DE_LA',
    color: colors.accentInvert,
  },
  tagline: {
    fontSize: 18,
    color: '#fff',
    color: colors.accentInvert,
    fontFamily: 'Roboto',
    // fontFamily: 'Playwrite_DE_LA',
  },
});


export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authContainer: {
    width: '90%',
    padding: 20,
    // backgroundColor: '#fff',
    borderRadius: 10,
    // elevation: 5,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 3,
  },
  authHeader: {
    marginBottom: 20,
    alignItems: 'center',
  },
  authTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    color: colors.accentInvert,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subHeaderText: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
  },
  authForm: {
    marginTop: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginTop: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    opacity: 0.8,
  },
  inputIcon: {
    marginRight: 10,
    color: '#000',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    color: '#000',
  },
  inputPlaceholder: {
    color: '#333',
  },
  authButton: {
    backgroundColor: colors.accent,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    color: '#fff',
  },
  authBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  passwordStrength: {
    fontSize: 14,
    marginBottom: 5,
    color: '#fff',
  },
  errorText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#cc4c4c',
    fontWeight: 'bold',
  },
  authLinkWrapper: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  authLinkText: {
    fontSize: 14,
    color: '#62A9FF',
    fontWeight: 'bold',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inOneLine: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  disclaimerPopup: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  disclaimerContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  disclaimerButton: {
    backgroundColor: colors.accent,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disclaimerButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  disclaimerText: {
    fontSize: 16,
    color: '#333',
  },
  disclaimerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

export const markdownStyles = StyleSheet.create({
  body: { fontSize: 16 },
  // heading1: { color: "#4A90E2", fontSize: 24, fontWeight: "bold" },
  // strong: { color: "#D32F2F" }, // Bold text
  // em: { color: "#FFA000" }, // Italic text
  // link: { color: "#673AB7", textDecorationLine: "underline" }, // Hyperlinks
  // bullet_list: { marginLeft: 10 }, // Bullet list
  // list_item: { marginVertical: 5 },
  // ordered_list: { fontSize: 16, marginLeft: 10 }, // Ordered list
  // ordered_list: { fontSize: 16, marginLeft: 10 }, // Ordered list
  // list_item: { marginVertical: 5 },
})


export default styles;
