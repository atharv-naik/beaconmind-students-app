import React, { Component } from "react";
import { ImageBackground } from "react-native";
import { styles as baseStyles } from "../styles/global";

export class AuthBackground extends Component {
  render() {
    return (
      <ImageBackground
        source={require("@/assets/images/bg/2.jpg")}
        style={baseStyles.bgImage}
        blurRadius={2.5}
      />
    );
  }
}

export default AuthBackground;
