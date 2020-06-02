import * as React from "react";
import { FunctionComponent, useContext } from "react";
import {
    StyleSheet,
    View,
    Text,
} from "react-native";
import { FontStyle } from "../styles/FontStyles";
import { ARViewerTheme } from "../styles/ARViewerTheme";

const styles = StyleSheet.create({
    bubble: {
        flexDirection: "row",
        margin: 8,
        minHeight: 60,
        borderRadius: 100,
        backgroundColor: "rgba(255,255,255,0.75)",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 12.875,
        shadowOffset: {
            width: 0,
            height: 1.83929
        }
    },
    text: {
        marginHorizontal: 30,
        marginVertical: 8,
        // Note, known bug in React Native version, flexWrap doesn't work as expected. This is the work around, with the flexDirection="row" above
        flexShrink: 1,
        color: ARViewerTheme.mainColor,
        textAlign: "center"
    }
});

/**
 * This enum represents the type of measurements supported by a given measurement session.
 */
export enum TeachingMomentType {
    hidden = 0,
    startTracking = 1,
    lostTracking = 2,
    tapToPlace = 10
}

export interface TeachingMomentProps {
    teachingMomentType: TeachingMomentType;
}

export const TeachingMoment: FunctionComponent<TeachingMomentProps> = ({ teachingMomentType }) => {
    function convertTypeToString(teachingMomentType: TeachingMomentType): string {
        switch (teachingMomentType) {
            case TeachingMomentType.startTracking:
                return ("Point device at a surface and move it slowly left and right");
            case TeachingMomentType.lostTracking:
                return "Tracking lost" + "\n" + "Point device at a surface and move it slowly left and right";
            case TeachingMomentType.tapToPlace:
                return "Tap anywhere to place";
            default:
                return "Type Not Supported";
        }
    }

    return (
        teachingMomentType !== TeachingMomentType.hidden ?
            (
                <View style={styles.bubble}>
                    <Text style={[FontStyle.normal, styles.text]}>{convertTypeToString(teachingMomentType)}</Text>
                </View>
            ) : <></>
    );

};