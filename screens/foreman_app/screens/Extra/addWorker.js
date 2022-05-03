import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

export default function AddWorker({ submitHandler}) {

    const [text, setText] = useState('');

    const changeHandler = (val) => {
        setText(val)
    }
    return (
        <View>
            <TextInput 
            style={StyleSheet.input}
            placeholder='new worker...'
            onChangeText={changeHandler}
            ></TextInput>
            <Button onPress={() => submitHandler(text)} title='add todo' color='coral'></Button>
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        marginBottom: 10,
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
    }
})