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
import AntDesign from '@expo/vector-icons/AntDesign';
import LottieView from 'lottie-react-native';
import * as Print from 'expo-print';

import * as Sharing from 'expo-sharing';
import { API_KEY_GEMINI } from '../Config/APIConfig';

// Constants
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
const API_KEY = API_KEY_GEMINI;

const DisplayDataScreen = () => {
    const [inputTextEdit, setInputTextEdit] = useState('');
    const [generatedText, setGeneratedText] = useState('');
    const [loading, setLoading] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [prevData, setPrevData] = useState('')
    const navigation = useNavigation();
    const route = useRoute();
    const [edt, setedt] = useState(true);
    const [temp, setTemp] = useState('')
    const [newDataVisible, setNewDataVisible] = useState(true)

    const { Topic = 'Default Topic', Keywords = [] } = route.params || {};
    const [topic, setTopic] = useState(Topic)
    const [words, setWords] = useState(Platform.OS !== 'web' ? 300 : 1000)
    const promptToCreatePrompt = `Generate a detailed and engaging prompt for creating an essay of approximately ${words} words. The essay should be well-structured, concise, and written in an informative tone. The topic is "${Topic}", and it should incorporate the following keywords: "${Keywords}". Ensure the prompt encourages creativity and relevance while focusing on the main theme.`;

    const fetchPrompt = async () => {
        setLoading(true);
        try {
            console.log("Fetching prompt...")
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
            console.log('Prompt Error:', error);
            Alert.alert('Error', error.message || 'An error occurred while generating the prompt.');
        } finally {
            setLoading(false);
        }
    };

    const fetchGeneratedText = async () => {
        setLoading(true);
        try {
            console.log("Fetching essay...")
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
            console.log('Text Generation Error:', error);
            Alert.alert('Error', error.message || 'An error occurred while generating the text.');
        } finally {
            setLoading(false);
        }
    };

    const editWithAI = async () => {
        setedt(!edt);
        if (inputTextEdit.trim()) {
            setLoading(true);
            try {
                const aiPrompt = `Contenet: ${generatedText}\n\nQuery: "${inputTextEdit.trim()}\n\n Words:${words}`;

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
                    setPrevData(generatedText)
                    setGeneratedText(enhancedText);
                    setInputTextEdit(''); // Clear input after processing
                } else {
                    throw new Error(data.error?.message || 'Failed to enhance the text.');
                }
            } catch (error) {
                console.log('AI Enhancement Error:', error);
                Alert.alert('Error', error.message || 'An error occurred while enhancing the text.');
            } finally {
                setLoading(false);
                setTopic(Topic + "(new version)")
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


    const handleShare = async () => {
        try {
            if (!generatedText) {
                Alert.alert('No Content', 'There is no content to share. Please generate or edit some text first.');
                return;
            }

            // Sanitize the file name to remove invalid characters
            const sanitizedFileName = `${Topic.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;

            // A4 page size in CSS: 210mm x 297mm
            const htmlContent = `
                <html>
                    <head>
                        <style>
                            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap'); /* Include Roboto font */
                            
                            @page {
                                size: A4;
                                margin: 20mm; /* Adjust margins as needed *editWithAI/
                            }
                            body {
                                font-family: Arial, sans-serif;
                                font-size: 14px;
                                line-height: 1.5;
                                word-wrap: break-word;
                                
                            }
                            h1 {
                                text-align: center;
                                font-size: 20px;
                                margin-bottom: 20px;
                            }
                            p {
                                white-space: pre-wrap;
                                word-wrap: break-word;
                                font-family: 'Roboto', sans-serif; /* Use Roboto font for paragraphs */
                                font-size: 14px;
                                line-height: 1.6;
                                text-align: justify;
                            }
                        </style>
                    </head>
                    <body>
                        <h1>${topic}</h1>
                        <p>${generatedText}</p>
                    </body>
                </html>
            `;

            // Generate the PDF file
            const { uri } = await Print.printToFileAsync({
                html: htmlContent,
                fileName: sanitizedFileName,
            });

            console.log('PDF generated at:', uri);

            // Share the generated PDF
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri);
                //  Alert.alert('Success', `The PDF "${sanitizedFileName}" has been shared successfully!`);
            } else {
                Alert.alert('Sharing Unavailable', 'Sharing is not available on this device.');
            }
        } catch (error) {
            console.log('Error sharing PDF:', error);
            Alert.alert('Error', error.message || 'An error occurred while sharing the PDF.');
        }
    };

    const handleDiscard = () => {

        Alert.alert("Are you sure?", "Do you want to discard new changes", [
            {
                text: "No",
                onPress: () => {
                }
            },
            {
                text: "Yes",
                onPress: () => {
                    setGeneratedText(prevData)
                    setedt(true)
                    setTopic(Topic)
                }
            }
        ])
    }

    const handleSave = () => {
        setPrevData('')
        setedt(true)
        setTopic(Topic)
    }
    const handleLongPress = () => {
        if (!edt) {
            if (newDataVisible) {
                setTemp(generatedText); // Store the current generated text in temp
                setGeneratedText(prevData);
                setTopic(Topic + " (old version)") // Display the previous data
            } else {
                setGeneratedText(temp);
                setTopic(Topic + " (new version)")  // Revert to the temporary stored data
            }
            setNewDataVisible(!newDataVisible);

        }
    };




    return (
        <LinearGradient colors={['#c9def4', '#f5ccd4', '#b8a4c9']} style={styles.container}>
            <SafeAreaView style={styles.background}>
                <View style={styles.headers}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color="gray" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Writezy</Text>
                    {
                        edt ? <TouchableOpacity style={styles.shareButton} onPress={() => { handleShare() }}>
                            <Feather name="share" size={24} color="gray" />
                        </TouchableOpacity> :
                            <TouchableOpacity style={styles.shareButton} onPress={handleLongPress}>
                                <AntDesign name="swap" size={24} color="gray" />
                            </TouchableOpacity>
                    }
                </View>

                <View style={styles.txtArea}>
                    <Text style={styles.outputLabel}>{topic}</Text>
                    <ScrollView
                        contentContainerStyle={{
                            flexGrow: 1, // Ensures content inside the ScrollView can grow
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        showsVerticalScrollIndicator={false}
                        style={{ flex: 1 }} // Ensures ScrollView takes up the available space
                    >
                        <View style={styles.centeredContent}>
                            {loading ? (
                                Platform.OS === 'web' ? <Text style={styles.loadingText}>Loading...</Text> : <LottieView
                                    source={require('../assets/Animations/AiLoading.json')}
                                    autoPlay
                                    loop
                                    style={styles.loadingAnimation}
                                />
                            ) : (
                                <Text style={styles.txtAreaText}>{generatedText || 'No content available.'}</Text>
                            )}
                        </View>
                    </ScrollView>
                </View>



                {edt && <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.textbox}>
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
                </KeyboardAvoidingView>}
                {!edt &&
                    <View style={styles.edt_buttons}>
                        <LinearGradient colors={['#ed5871', '#ed5871']} start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={[styles.gradient, styles.btn]}>
                            <TouchableOpacity style={styles.btn} onPress={handleDiscard} >
                                <Text style={styles.txt}>Discard</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                        <LinearGradient colors={['#e68b29', '#f059ea']} start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }} style={[styles.gradient, styles.btn]}>
                            <TouchableOpacity style={styles.btn} onPress={handleSave} >
                                <Text style={styles.txt}>Save</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>

                }
            </SafeAreaView>
        </LinearGradient>
    );
};

export default DisplayDataScreen;

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 40 : Platform.OS !== 'web' ? 0 : 40
    },
    background: { flex: 1, alignItems: 'center' },
    backButton: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 50,
        elevation: 5,
    },
    loadingText: {
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
        marginTop: 20,
    },

    headers: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
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
        height: Platform.OS === 'android' ? '75%' : '78%',
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
    textbox: { position: 'absolute', bottom: 30, width: '94%' },
    txtInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 10,
        borderRadius: 10,
        elevation: 5,
        padding: 10,
    },
    input: { flex: 1, fontSize: 16, color: '#333', outlineStyle: 'none', },
    fabGradient: {
        borderRadius: 50,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendIcon: { height: 30, width: 30, justifyContent: 'center', alignItems: 'center' },
    loadingAnimation: { width: 150, height: 150 },
    edt_buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
        paddingHorizontal: 20, // Adjust padding as needed
    },
    btn: {
        flex: 1,
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10, // Add spacing between buttons
    },
    txt: {
        color: 'white',
        fontSize: 20,
        fontWeight: 700,
        fontFamily: 'Delius-Regular'
    },
    discard: {
        backgroundColor: 'white',
    },
    dtxt: {
        color: 'black',
    },
    gradient: {
        borderRadius: 10,
    },
});
