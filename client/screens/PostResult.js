import React from 'react'
import { View, Pressable, Text, Image, StyleSheet, Dimensions, StatusBar } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'

const PostResult = (props) => {

    const post = props.post;

    const navigation = useNavigation();

    return (
        <Pressable style={styles.container}
            onPress={() => {
                navigation.navigate('PostDetail', {
                    post: post
                });
            }}>
            <StatusBar style="light" />
            <View style={styles.posts}>
                <Image
                    source={{
                        uri: post.postUrl[0],
                    }}
                    style={styles.postImage}
                />
            </View>
            <View style={styles.postInfo}>
                <Text style={styles.description} numberOfLines={2}>{post.description}</Text>
                <Text style={styles.price}>RM {post.price}/month</Text>
                <Text style={styles.location}>Area: {post.location}</Text>
                <View style={styles.room}>
                    <Ionicons name="bed-outline" size={15} />
                    <Text style={styles.type}>{post.type}</Text>
                </View>
            </View>
        </Pressable>
    )
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        marginLeft: 8,
        marginRight: 8,
        borderRadius: 10,
        elevation: 5,
        backgroundColor: 'white',
        flexDirection: 'row',
    },

    posts: {
        padding: 5,
    },  

    postImage: {
        width: Dimensions.get('window').width - 220,
        resizeMode: 'cover',
        borderRadius: 10,
        height: Dimensions.get('window').height - 630,
        
    },

    postInfo: {
        marginLeft: 5,
        paddingTop: 10,
        width: 180,
    },
    
    description: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: 'bold',
    },

    price: {
        fontWeight: 'bold',
        color: 'orange',
        fontSize: 14,
        marginTop: 8,
    },

    location: {
        marginTop: 5,
        fontSize: 12,
        fontStyle: 'italic',
        color: 'grey',
    },

    room: {
        marginTop: 10,
        flexDirection: 'row',
    },

    type: {
        fontSize: 12,
        color: '#504A4B',
        marginLeft: 5,
    },

})

export default PostResult;