import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import LottieView from 'lottie-react-native';

// Constants
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
const API_KEY = 'AIzaSyBy9cF4mrwkzNJvtR7Za_QbRInZxpjSDRs';

const DisplayDataScreen = () => {
    const [inputTextEdit, setInputTextEdit] = useState('');
    const [generatedText, setGeneratedText] = useState('');
    const [loading, setLoading] = useState(false);
    const [prompt, setPrompt] = useState('');
    const navigation = useNavigation();
    const route = useRoute();

    const { Topic = 'Default Topic', Keywords = [] } = route.params || {};

    const promptToCreatePrompt = `Generate a detailed and engaging prompt for creating an essay of approximately 200 words. The essay should be well-structured, concise, and written in an informative tone. The topic is "${Topic}", and it should incorporate the following keywords: "${Keywords}". Ensure the prompt encourages creativity and relevance while focusing on the main theme.`;

    const fetchPrompt = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: promptToCreatePrompt }],
                        },
                    ],
                }),
            });
            const data = await response.json();
            if (response.ok) {
                const generatedPrompt = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No prompt generated.';
                setPrompt(generatedPrompt);
            } else {
                throw new Error(data.error?.message || 'Failed to generate prompt.');
            }
        } catch (error) {
            console.error('Prompt Error:', error);
            Alert.alert('Error', error.message || 'An error occurred while generating the prompt.');
        } finally {
            setLoading(false);
        }
    };

    const fetchGeneratedText = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: prompt }],
                        },
                    ],
                }),
            });
            const data = await response.json();
            if (response.ok) {
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No content generated.';
                setGeneratedText(text);
            } else {
                throw new Error(data.error?.message || 'Failed to generate text.');
            }
        } catch (error) {
            console.error('Text Generation Error:', error);
            Alert.alert('Error', error.message || 'An error occurred while generating the text.');
        } finally {
            setLoading(false);
        }
    };

    const editWithAI = async () => {
        if (inputTextEdit.trim()) {
            setLoading(true);
            try {
                const aiPrompt = `${generatedText}\n\nEnhance the following text with improvements: "${inputTextEdit.trim()}"`;

                const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [{ text: aiPrompt }],
                            },
                        ],
                    }),
                });

                const data = await response.json();
                if (response.ok) {
                    const enhancedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No content generated.';
                    setGeneratedText(enhancedText);
                    setInputTextEdit(''); // Clear input after processing
                } else {
                    throw new Error(data.error?.message || 'Failed to enhance the text.');
                }
            } catch (error) {
                console.error('AI Enhancement Error:', error);
                Alert.alert('Error', error.message || 'An error occurred while enhancing the text.');
            } finally {
                setLoading(false);
            }
        } else {
            Alert.alert('Validation Error', 'Please enter a valid text for AI editing.');
        }
    };

    useEffect(() => {
        if (Topic && Keywords) fetchPrompt();
    }, [Topic, Keywords]);

    useEffect(() => {
        if (prompt) fetchGeneratedText();
    }, [prompt]);

    return (
        <LinearGradient colors={['#c9def4', '#f5ccd4', '#b8a4c9']} style={styles.container}>
            <SafeAreaView style={styles.background}>
                <View style={styles.headers}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color="gray" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Writezy</Text>
                    <TouchableOpacity style={styles.shareButton} onPress={() => Alert.alert('Share', 'Share functionality coming soon!')}>
                        <Feather name="share" size={24} color="gray" />
                    </TouchableOpacity>
                </View>

                <View style={styles.txtArea}>
                    <Text style={styles.outputLabel}>{Topic}</Text>
                    <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
                        <View style={styles.centeredContent}>
                            {loading ? (
                                <LottieView source={require('../assets/Animations/AiLoading.json')} autoPlay loop style={styles.loadingAnimation} />
                            ) : (
                                <Text style={styles.txtAreaText}>{generatedText || 'No content available.'}</Text>
                            )}
                        </View>
                    </ScrollView>
                </View>

                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.textbox}>
                    <View style={styles.txtInput}>
                        <TextInput
                            value={inputTextEdit}
                            onChangeText={setInputTextEdit}
                            placeholder="Edit with AI"
                            style={styles.input}
                            placeholderTextColor="#777"
                        />
                        <LinearGradient colors={['#f9c58d', '#f492f0']} style={styles.fabGradient}>
                            <TouchableOpacity style={styles.sendIcon} onPress={editWithAI}>
                                <FontAwesome name="magic" size={20} color="white" />
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default DisplayDataScreen;

// Styles
const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: Platform.OS === 'android' ? 20 : 0 },
    background: { flex: 1, alignItems: 'center' },
    backButton: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 50,
        elevation: 5,
    },
    headers: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 25,
        color: '#103783',
        fontFamily: 'Delius-Regular'
    },
    shareButton: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 50,
        elevation: 5,
    },
    txtArea: {
        backgroundColor: 'white',
        height: '75%',
        width: '95%',
        padding: 15,
        marginTop: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    outputLabel: {
        fontSize: 18,
        color: '#555',
        marginBottom: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    txtAreaText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
        textAlign: 'justify',
    },
    textbox: { position: 'absolute', bottom: 50, width: '90%' },
    txtInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 10,
        borderRadius: 10,
        elevation: 5,
        padding: 10,
    },
    input: { flex: 1, fontSize: 16, color: '#333' },
    fabGradient: {
        borderRadius: 50,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendIcon: { height: 30, width: 30, justifyContent: 'center', alignItems: 'center' },
    loadingAnimation: { width: 150, height: 150 },
});
