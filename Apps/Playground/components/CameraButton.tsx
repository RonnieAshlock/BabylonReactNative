//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
import * as React from "react";
import { FunctionComponent } from "react";
import {
    StyleSheet,
    TouchableOpacity,
    Text
} from "react-native";
import { CircleButtonStyles } from "../styles/CircleButtonStyles";
import { IconFontStyle } from "../styles/FontStyles";
import { ARViewerTheme } from "../styles/ARViewerTheme";

export interface CameraButtonProps {
    cameraClickHandler: () => void;
    style: {
        height: number,
        width: number,
        marginHorizontal?: number,
        marginVertical?: number,
        marginTop?: number
        marginBottom?: number
    };
}

export const CameraButton: FunctionComponent<CameraButtonProps> = (props: CameraButtonProps) => {
    const styles = StyleSheet.create({
        button: {
            height: props.style.height,
            width: props.style.width,
            borderRadius: props.style.height / 2,
            marginHorizontal: props.style.marginHorizontal,
            marginVertical: props.style.marginVertical,
            marginTop: props.style.marginTop,
            marginBottom: props.style.marginBottom
        },
        icon: {
            fontSize: 22,
            color: ARViewerTheme.mainColor
        }
    });

    return (
        <TouchableOpacity
            onPress={props.cameraClickHandler}
            style={[CircleButtonStyles.button, styles.button]}>
            <Text style={[IconFontStyle.icon, styles.icon]}>{"\uE710"}</Text>
        </TouchableOpacity>
    );

};