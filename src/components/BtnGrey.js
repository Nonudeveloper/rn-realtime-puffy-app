import React from "react";
import { TouchableOpacity, Text } from "react-native";

const BtnGrey = props => {
    return (
        <TouchableOpacity style={props.active === true ? styles["btn" + props.theme_active] : styles.btn} onPress={props.onPress}>
            <Text style={props.active === true ? styles["btnText" + props.theme_active] : styles.btnText}>{props.value}</Text>
        </TouchableOpacity>
    );
};

const styles = {
    btn: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#BFBFBF",
        borderRadius: 5,
        backgroundColor: "#FFF",
        marginLeft: 5,
        marginRight: 5,
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.7
    },
    btnText: {
        color: "#BFBFBF",
        fontSize: 16,
        textAlign: "center",
        fontFamily: "Helvetica",
        marginTop: 8,
        marginBottom: 8,
        marginLeft: 10,
        marginRight: 10
    },
    btnGreen: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#18B5C3",
        borderRadius: 5,
        backgroundColor: "#18B5C3",
        marginLeft: 5,
        marginRight: 5,
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.7
    },
    btnTextGreen: {
        color: "#FFF",
        fontSize: 16,
        textAlign: "center",
        fontFamily: "Helvetica",
        marginTop: 8,
        marginBottom: 8,
        marginLeft: 10,
        marginRight: 10
    }
};

export default BtnGrey;
