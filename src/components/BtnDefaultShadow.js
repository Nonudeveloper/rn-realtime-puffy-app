import React from "react";
import { TouchableOpacity, Text } from "react-native";

const BtnDefaultShadow = props => {
    return (
        <TouchableOpacity style={props.active === true ? styles["btn" + props.theme_active] : styles.btn} onPress={props.onPress}>
            <Text style={props.active === true ? styles["btnText" + props.theme_active] : styles.btnText}>{props.value}</Text>
        </TouchableOpacity>
    );
};

const styles = {
    btn: {
        borderWidth: 1,
        borderColor: "#010101",
        borderRadius: 10,
        backgroundColor: "#FFF",
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 20,
        paddingTop: 2,
        paddingBottom: 2,
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.7,
        shadowRadius: 2
    },
    btnText: {
        color: "#010101",
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
        letterSpacing: 5,
        fontFamily: "Helvetica",
        marginTop: 8,
        marginBottom: 8,
        marginLeft: 10,
        marginRight: 10
    },
    btnGreen: {
        borderWidth: 1,
        borderColor: "#18B5C3",
        borderRadius: 10,
        backgroundColor: "#18B5C3",
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 20,
        paddingTop: 2,
        paddingBottom: 2,
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.7,
        shadowRadius: 2
    },
    btnTextGreen: {
        color: "#FFF",
        fontSize: 14,
        textAlign: "center",
        fontWeight: "bold",
        letterSpacing: 5,
        fontFamily: "Helvetica",
        marginTop: 8,
        marginBottom: 8,
        marginLeft: 10,
        marginRight: 10
    }
};

export default BtnDefaultShadow;
