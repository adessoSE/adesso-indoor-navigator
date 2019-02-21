import { StyleSheet } from "react-native";

export const localStyles = StyleSheet.create({
  loginContainer: {
    justifyContent: "center",
    marginTop: 50,
    padding: 20,
    backgroundColor: "#ffffff"
  },
  viroContainer: {
    flex: 1,
    backgroundColor: "black"
  },
  outer: {
    flex: 1,
    backgroundColor: "rgba(1,1,1,0.2)"
  },
  arView: {
    flex: 2,
    backgroundColor: "transparent"
  },
  map: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    position: "absolute",
    backgroundColor: "transparent"
  },
  inner: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "black"
  },
  titleText: {
    paddingTop: 30,
    paddingBottom: 20,
    color: "#fff",
    textAlign: "center",
    fontSize: 25
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 20
  },
  debugText: {
    color: "#fff",
    textAlign: "left",
    fontSize: 16
  },
  buttons: {
    height: 70,
    width: 250,
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#68a0cf",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff"
  },
  startARButton: {
    height: 70,
    width: 250,
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#cc2222",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff"
  },
  exitButton: {
    height: 50,
    width: 100,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#68a0cf",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff"
  },
  icon: {
    height: 64,
    width: 64
  },
  arrowleft: {
    width: 73,
    height: 147
  },
  arrowtop: {
    width: 73,
    height: 147,
    transform: [{ rotate: "90deg" }]
  },
  arrowright: {
    width: 73,
    height: 147,
    transform: [{ rotate: "180deg" }]
  },
  arrowbottom: {
    width: 73,
    height: 147,
    transform: [{ rotate: "-90deg" }]
  }
});

export default localStyles;