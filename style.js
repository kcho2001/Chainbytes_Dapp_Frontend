import { StyleSheet } from "react-native";

export const homeStyles = StyleSheet.create({
  screen: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    height: "100%"
  },
  mainContainer: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    paddingLeft: 5,
    paddingTop: 100,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  subContainer: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    paddingLeft: 35,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  mainText: {
    fontSize: 50,
    paddingBottom: 5,
    paddingTop: 0,
    marginTop: 0,
    fontFamily: "HelveticaNeue-Bold"
  },
  subText: {
    fontSize: 25,
    paddingBottom: 5,
    paddingTop: 0,
    marginTop: 0,
    fontFamily: "HelveticaNeue-Bold",
  },
  smolText: {
    fontSize: 10,
    color: "black",
    paddingBottom: 5,
    paddingTop: 0,
    marginTop: 0,
  },
  image: {
    height: 350,
    width: 350,
    borderRadius: 40,
  },
  imageView: {
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: 'red',
    paddingTop: 20,
  },
});

export const tabBarStyles = StyleSheet.create({
  bottomTabs: {
    position: "absolute",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    bottom: '3%',
    left: 15,
    right: 15,
    borderRadius: 15,
    borderWeight: 2,
    height: 55,
    shadowColor: "lightgrey",
    shadowOffset: { width: 0, height: 0, },
    shadowOpacity: 0.6,
    shadowRadius: 5,
  },
  tabBarItemStyle: {
    backgroundColor: '#00ff00',
    margin: 5,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomBar: {
    backgroundColor: "#1e140a",
    alignContent: "flex-end",
    justifyContent: "flex-end",
  },
  mainText: {
    fontSize: 20,
    color: "white",
  },
  headerTitleStyle: {
    fontSize: 20,
    fontWeight: "800",
    fontFamily: "HelveticaNeue-Bold",
  }
})

export const listStyle = StyleSheet.create({
  
})