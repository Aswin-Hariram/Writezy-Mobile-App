import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function AddKeywords({ setKeywordsVisible, keywords, setKeywords, inputText, setInputText }) {
    const addKeyword = () => {
      if (inputText.trim() && !keywords.includes(inputText.trim()) && keywords.length < 5) {
        setKeywords([...keywords, inputText.trim()]);
        setInputText('');
      }
    };
  
    const removeKeyword = (keyword) => {
      const updatedKeywords = keywords.filter((item) => item !== keyword);
      setKeywords(updatedKeywords);
      if (updatedKeywords.length === 0) {
        setKeywordsVisible(false);
      }
    };
  
    return (
      <View style={styles.container}>
        <View style={styles.keywordsContainer}>
          {keywords.map((keyword, index) => (
            <View key={index} style={styles.keywordTag}>
              <Text style={styles.keywordText}>{keyword}</Text>
              <TouchableOpacity onPress={() => removeKeyword(keyword)}>
                <AntDesign name="close" size={18} color="red" />
              </TouchableOpacity>
            </View>
          ))}
          <TextInput
            style={styles.input}
            value={inputText}
            placeholder={keywords.length === 0 ? "Enter Keywords" : ""}
            placeholderTextColor="#777"
            onChangeText={setInputText}
            onSubmitEditing={addKeyword}
            returnKeyType="done"
            editable={keywords.length < 5}  // Disable input when limit is reached
          />
        </View>
        <Text style={[styles.limitText, keywords.length === 5 && styles.limitReached]}>
          {keywords.length === 5 ? 'Maximum 5 keywords reached' : `Keywords: ${keywords.length}/5`}
        </Text>
      </View>
    );
  }
  

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'white',
    },
    keywordsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        padding: 5,
        minHeight: 40,
    },
    keywordTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 5,
        margin: 4,
    },
    keywordText: {
        fontSize: 14,
        marginRight: 8,
        color: '#333',
        fontFamily: 'Delius-Regular',
    },
    input: {
        flex: 1,
        minWidth: 100,
        paddingVertical: 5,
        paddingHorizontal: 8,
        fontSize: 14,
        color: '#333',
    },
    limitText: {
        marginTop: 8,
        fontSize: 12,
        color: '#555',
        textAlign: 'right',
    },
    limitReached: {
        color: 'red',
    },
});
