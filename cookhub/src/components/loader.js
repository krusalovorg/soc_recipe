import React from "react";
import { SafeAreaView, View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";

export default function Loader() {
    return (
        <SafeAreaView>
            <View>
                <Spinner visible={true} />
            </View>
        </SafeAreaView>
    )
}