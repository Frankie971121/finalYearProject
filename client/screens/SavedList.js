import React from 'react'
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button } from 'react-native'
import { db, auth } from '../utils/FirebaseConfig'
import { useState, useEffect, useRef } from 'react'
import SavedPost from './SavedPost'
import * as firebase from 'firebase'
import 'firebase/firestore'
import EmptyResult from './EmptyResult'

export default function SavedList({ navigation }) {

    const [post, setPost] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
                        db.collection('users')
                            .doc(auth.currentUser.uid)
                            .get()
                            .then((documentSnapshot) => {
                                
                                let userData = documentSnapshot.data();
                                let link = userData.savedList;
                                const userPosts = [];

                                link.forEach((postId) => {
                                    db.collectionGroup('userPosts')
                                        .where('postUid', '==' , postId)
                                        .get()
                                        .then(querySnapshot => {
                                            if(querySnapshot.size == 0) {
                                                setLoading(false);
                                            }
                                            else {
                                                querySnapshot.forEach((doc) => {
                                                    userPosts.push({
                                                        ...doc.data(),
                                                        key: doc.id,
                                                    });
                                                });
                                            }
                                            setPost(userPosts);
                                        });
                                });
                            });
                            setLoading(false);
        });

        return unsubscribe;
    }, [navigation]);

    if(loading) {
        return <ActivityIndicator />;
    }

    else if(!loading && post.length == 0) {
        return <EmptyResult />
    }


    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Saved List</Text>
            <FlatList
                style={styles.postContainer}
                data={post}
                renderItem={({ item }) => (
                    <SavedPost post={item} />
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
