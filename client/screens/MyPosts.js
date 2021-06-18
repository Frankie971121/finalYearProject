import React from 'react'
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native'
import { db, auth } from '../utils/FirebaseConfig'
import { useState, useEffect } from 'react'
import Post from './Post'
import { useIsFocused } from "@react-navigation/native"

export default function MyPosts({ navigation }) {

    const [post, setPost] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
                        setPost([]);
                        db.collection('posts')
                        .doc(auth.currentUser.uid)
                        .collection('userPosts')
                        .get()
                        .then((querySnapShot) => {
                            const userPost = [];
                            querySnapShot.forEach(documentSnapShot => {
                                userPost.push({
                                    ...documentSnapShot.data(),
                                    key: documentSnapShot.id,
                                });
                            });
                            setPost(userPost);
                            setLoading(false);
                        });
        });

        return unsubscribe;
    }, [navigation]);

    if(loading) {
        return <ActivityIndicator />;
    }


    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Post Listings</Text>
            <FlatList
                style={styles.postContainer}
                data={post}
                renderItem={({ item }) => (
                    <Post post={item} />
                )} />
        </View>
    )
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingTop: '10%',
        alignItems: 'center',
        backgroundColor: 'white',
    },

    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#E56717',
    },

    postContainer: {
        marginTop: '10%',
        marginBottom: '4%',
    },
});
