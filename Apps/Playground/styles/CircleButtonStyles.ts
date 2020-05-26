//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!

import { StyleSheet } from "react-native";
import { ARViewerTheme } from "./ARViewerTheme";

export const ButtonBaseStyles = StyleSheet.create({
    buttonBase: {
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonShadows: {
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 12.875,
        shadowOffset: {
            width: 0,
            height: 1.83929
        }
    }
});

export const CircleButtonStyles = StyleSheet.create({
    button: {
        ...ButtonBaseStyles.buttonBase,
        ...ButtonBaseStyles.buttonShadows,
        backgroundColor: ARViewerTheme.whiteColor,
        borderColor: ARViewerTheme.mainColor,
    },
    disabledButton: {
        ...ButtonBaseStyles.buttonBase,
        ...ButtonBaseStyles.buttonShadows,
        backgroundColor: ARViewerTheme.disabledColor,
        opacity: 0.7,
        borderColor: ARViewerTheme.disabledBorderColor
    },
    disabledText: {
        color: ARViewerTheme.disabledTextColor
    }
});