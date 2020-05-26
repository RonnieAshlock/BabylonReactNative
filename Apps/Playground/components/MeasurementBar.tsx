//!
//! Copyright (C) Microsoft Corporation.  All rights reserved.
//!
import * as React from "react";
import { FunctionComponent } from "react";
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text
} from "react-native";
import { CameraButton } from "./CameraButton";
import { CircleButtonStyles, ButtonBaseStyles } from "../styles/CircleButtonStyles";
import { IconFontStyle, FontStyle } from "../styles/FontStyles";
import { ARViewerTheme } from "../styles/ARViewerTheme";

export interface MeasurementBarProps {
    cameraClickHandler: () => void;
    submitClickHandler: () => void;
    addClickHandler: () => void;
    undoClickHandler: () => void;
    submitEnabled: boolean;
    undoEnabled: boolean;
    submitButtonText: string;
}


const plusButtonSize: number = 70;
const centerLeftButtonSize: number = 48;

export const MeasurementBar: FunctionComponent<MeasurementBarProps> = (props: MeasurementBarProps) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: "row",
            marginBottom: 8
        },
        centerLeftButton: {
            marginHorizontal: 8,
            marginTop: (plusButtonSize / 2) - centerLeftButtonSize / 2,
            height: centerLeftButtonSize,
            width: centerLeftButtonSize,
            borderRadius: centerLeftButtonSize / 2
        },
        plusIcon: {
            fontSize: 28,
            color: ARViewerTheme.textColor
        },
        addButton: {
            marginHorizontal: 8,
            height: plusButtonSize,
            width: plusButtonSize,
            borderRadius: 120,
            backgroundColor: ARViewerTheme.mainColor,
            borderColor: ARViewerTheme.mainColor,
            borderWidth: 2,
            justifyContent: "center",
            alignItems: "center"
        },
        submitButton: {
            marginTop: (plusButtonSize / 2) - centerLeftButtonSize / 2,
            height: centerLeftButtonSize,
            width: 90,
            borderRadius: 120,
            backgroundColor: ARViewerTheme.mainColor,
            borderColor: ARViewerTheme.mainColor,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 8
        },
        submitText: {
            textAlign: "center",
            marginTop: 0,
            color: ARViewerTheme.textColor,
            ...FontStyle.normal
        },
        centerButtonsLeftView: {
            flexDirection: "row",
            flex: 1,
            justifyContent: "flex-end",
        },
        centerButtonView: {
            flexDirection: "row",
            justifyContent: "center"
        },
        rightButtonView: {
            flex: 1, flexDirection: "row",
            justifyContent: "flex-end"
        }
    });

    return (
        <View style={styles.container}>
            <View style={styles.centerButtonsLeftView}>
                <CameraButton cameraClickHandler={props.cameraClickHandler}
                    style={styles.centerLeftButton} />

                <TouchableOpacity
                    disabled={!props.undoEnabled}
                    onPress={props.undoClickHandler}
                    style={props.undoEnabled ?
                        [CircleButtonStyles.button, styles.centerLeftButton] :
                        [CircleButtonStyles.disabledButton, styles.centerLeftButton,]}>
                    <Text style={
                        props.undoEnabled ?
                            [IconFontStyle.icon, { color: ARViewerTheme.mainColor }] :
                            [IconFontStyle.icon, { color: ARViewerTheme.disabledTextColor }]}>{"\uE7A7"}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.centerButtonView}>
                <TouchableOpacity
                    onPress={props.addClickHandler}
                    style={[styles.addButton]}>
                    <Text style={[IconFontStyle.icon, styles.plusIcon]}>{"\uE710"}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.rightButtonView}>
                <TouchableOpacity
                    disabled={!props.submitEnabled}
                    onPress={props.submitClickHandler}
                    style={
                        props.submitEnabled ?
                            [ButtonBaseStyles.buttonShadows, styles.submitButton] :
                            [ButtonBaseStyles.buttonShadows, styles.submitButton, CircleButtonStyles.disabledButton]}>
                    <Text style={
                        props.submitEnabled ?
                            styles.submitText :
                            [styles.submitText, CircleButtonStyles.disabledText]}>{props.submitButtonText}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

};
