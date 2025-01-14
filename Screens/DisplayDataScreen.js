import React from 'react';
import { SafeAreaView, StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const DisplayDataScreen = () => {
    // Placeholder state for `keywordsVisible`
    const keywordsVisible = false;

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#c9def4', '#f5ccd4', '#b8a4c9']}
                style={styles.background}
            >
                {/* Back Button */}
                <TouchableOpacity style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="gray" />
                </TouchableOpacity>

                {/* Display Area */}
                <View style={styles.txtArea}>
                    <Text style={styles.outputLabel}>Your Output</Text>
                    <Text style={styles.txtAreaText}>This is your display area</Text>
                </View>

                {/* Input Box */}
                <View style={styles.textbox}>
                    <View
                        style={{
                            ...styles.txtInput,
                            borderBottomLeftRadius: !keywordsVisible ? 10 : 0,
                            borderBottomRightRadius: !keywordsVisible ? 10 : 0,
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10,
                        }}
                    >
                        <TextInput
                            placeholder="Enter Topic..."
                            style={styles.input}
                            placeholderTextColor="#777"
                        />
                        <LinearGradient
                            colors={['#f9c58d', '#f492f0']}
                            style={styles.fabGradient}
                        >
                            <TouchableOpacity style={styles.sendIcon}>
                                <MaterialCommunityIcons name="send" size={20} color="white" />
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default DisplayDataScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        backgroundColor:'white',
        padding: 10,
        borderRadius: 50,
        elevation: 5,
    },
    txtArea: {
        backgroundColor: 'white',
        height: '70%', // Adjust height as needed
        width: '90%',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
        marginBottom: 20,
    },
    outputLabel: {
        fontSize: 16,
        color: '#555',
        marginBottom: 10,
        fontWeight: 'bold',
    },
    txtAreaText: {
        fontSize: 18,
        marginTop: 10,
        color: '#333',
        textAlign: 'center',
    },
    textbox: {
        position: 'absolute',
        bottom: 50,
        width: '90%',
    },
    txtInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        padding: 9,
        elevation: 5,
    },
    input: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    fabGradient: {
        borderRadius: 50,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendIcon: {
        height: 30,
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
