import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Platform, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AddKeywords from './AddKeywords';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const GettingDataScreen = () => {
  const [keywordsVisible, setKeywordsVisible] = useState(false);
  const [keywords, setKeywords] = useState([]);
  const [inputText, setInputText] = useState('');
  const [topic, setTopic] = useState('');
  const navigation = useNavigation();

  const AddKeyword = () => {
    if (topic.length !== 0) {
      setKeywordsVisible(!keywordsVisible);
    } else {
      Toast.show({
        type: 'info',
        text1: 'Warning',
        text2: 'Enter topic to add keyword',
        swipeable: true,
        autoHide: true,
        visibilityTime: 3000, 
        topOffset: Platform.OS === 'android' ? 50 : 70,        
      });
    }
  }

  const handleGenerate = () => {
    if (topic.trim() === '') {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a topic before generating.',
        swipeable: true,
        autoHide: true,
        visibilityTime: 3000,
        topOffset: Platform.OS === 'android' ? 70 : 90,
      });
      return;
    }

    console.log('TopicSent:', topic);
    console.log('KeywordSent:', keywords);

    navigation.navigate('DisplayDataScreen', {
      Topic: topic,
      Keywords: keywords,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <LinearGradient colors={['#c9def4', '#f5ccd4', '#b8a4c9']} style={styles.background}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Feather name="menu" size={30} color="black" style={styles.icon} />
            <MaterialIcons name="exit-to-app" size={30} color="black" style={styles.icon} />
          </View>
          <View style={styles.centerContent}>
            <View style={styles.txtContainer}>
              <Text style={styles.title}>AI Assistant</Text>
              <View style={styles.subTextContainer}>
                <Text style={styles.helloTxt}>
                  Hello there <Text style={styles.highlight}>human!</Text>
                </Text>
                <Text style={{ ...styles.helloTxt, fontSize: 43 }}>
                  How can I <Text style={styles.highlight}>assist you?</Text>
                </Text>
              </View>
            </View>
            <LottieView source={require("../assets/Animations/AI.json")} autoPlay loop style={styles.animation} />
          </View>

          <View style={{ paddingBottom: 15 }}>
            <View style={{
              ...styles.txtInput,
              borderBottomLeftRadius: !keywordsVisible ? 10 : 0,
              borderBottomRightRadius: !keywordsVisible ? 10 : 0,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}>
              <TextInput
                placeholder="Enter Topic..."
                style={styles.input}
                placeholderTextColor="#777"
                onChangeText={setTopic}
                value={topic}
              />
              <LinearGradient
                colors={['#f9c58d', '#f492f0']}
                style={styles.fabGradient}
              >
                <TouchableOpacity style={styles.sendIcon} onPress={handleGenerate}>
                  <MaterialCommunityIcons name="send" size={24} color="white" />
                </TouchableOpacity>
              </LinearGradient>
            </View>

            {!keywordsVisible ? (
              <Text
                style={styles.addKeywordsText}
                onPress={AddKeyword}
              >
                Add Keywords
              </Text>
            ) : (
              <View style={styles.keywordContainer}>
                <AddKeywords 
                  setKeywordsVisible={setKeywordsVisible} 
                  keywords={keywords} 
                  setKeywords={setKeywords} 
                  inputText={inputText} 
                  setInputText={setInputText} 
                />
              </View>
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>
      <Toast />
    </ScrollView>
  );
};


export default GettingDataScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
    paddingHorizontal: 15,
    paddingBottom: 30,
    justifyContent: 'space-between',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    padding: 10,
  },
  centerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6f7bf7',
    textAlign: 'center',
  },
  background: {
    flex: 1,
    padding: 10
  },
  txtContainer: {
    alignItems: 'center',
  },
  subTextContainer: {
    alignItems: 'center',
  },
  helloTxt: {
    fontSize: 43,
    fontFamily: 'Zain-Regular',
    color: '#333',
    textAlign: 'center',
  },
  highlight: {
    color: '#103783',
  },
  txtInput: {
    backgroundColor: 'white',
    width: '100%',
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
    color: '#333',
  },
  sendIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  fabGradient: {
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  addKeywordsText: {
    textAlign: 'right',
    marginRight: 10,
    marginTop: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  keywordContainer: {
    padding: 1,
    backgroundColor: 'white',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopWidth: 0.3,
    borderTopColor: '#cccccc',
  },
  animation: {
    width: 300,
    height: 300,
  },
});
