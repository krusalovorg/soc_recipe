import React from "react";
import { Component } from "react";
import { Text, View } from "react-native";

export default class ErrorBoundries extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: '',
            errorInfo: '',
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.log('Error: ' + error);
        console.log('Error Info: ' + JSON.stringify(errorInfo));
        this.setState({
            error: error,
            errorInfo: errorInfo,
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Text>Oops!!! Something went wrong..</Text>
                    <Text>Error: {this.state.error.toString()}</Text>
                    <Text>Error Info: {JSON.stringify(this.state.errorInfo)}</Text>
                </View>
            );
        }
        return this.props.children;
    }
}
