import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, Dimensions, PanResponder, StyleSheet } from 'react-native';

const AnimatedPanel = ({ children, open, setOpen, height }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;

    const windowHeight = Dimensions.get('window').height;
    const panelHeight = height || windowHeight * 0.5;

    const handleRelease = (e, gestureState) => {
        if (gestureState.dy > height * 0.4) {
            setOpen(false);
            Animated.timing(translateY, {
                toValue: height,
                duration: 200,
                useNativeDriver: true,
            }).start();
        } else {
            setOpen(true);
            Animated.timing(translateY, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    };

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (e, gestureState) => {
                return gestureState.dy > 0 && gestureState.dx < 10 && gestureState.dy > 10;
            },
            onPanResponderMove: (e, gestureState) => {
                if (gestureState.dy < height) {
                    translateY.setValue(gestureState.dy - height);
                }
            },
            onPanResponderRelease: handleRelease,
            onPanResponderTerminate: handleRelease,
        })
    ).current;

    const handleToggle = () => {
        const toValue = open ? height : 0;
        setOpen(!open);
        Animated.timing(translateY, {
            toValue,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    useEffect(() => {
        handleToggle()
    }, [open])


    return (
        open &&
        <View style={{ position: "absolute", marginTop: "100%", left: 0, right: 0, backgroundColor: "black", zIndex: 1 }}>
            <Animated.View
                style={{
                    ...panResponder.panHandlers,
                    opacity: fadeAnim,
                    paddingLeft: 15,
                    paddingTop: 20,
                    height: panelHeight,
                    width: '100%',
                }}>
                <ScrollView>
                    {children}
                </ScrollView>
                <View style={styles.handle} onTouchEnd={handleToggle} />
            </Animated.View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: '#fff',
        zIndex: 999,
    },
    handle: {
        alignSelf: 'center',
        width: 50,
        height: 5,
        borderRadius: 5,
        backgroundColor: '#ccc',
        marginTop: 10,
        marginBottom: 10,
    },
});

export default AnimatedPanel;