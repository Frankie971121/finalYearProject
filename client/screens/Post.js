import React from 'react'
import { View, Pressable, Text, Image, Dimensions, StatusBar } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import EStyleSheet from 'react-native-extended-stylesheet';

const {height, width} = Dimensions.get('window');
EStyleSheet.build({$rem: width > 340 ? 18 : 16});

const Post = (props) => {

    const post = props.post;

    const navigation = useNavigation();

    return (
        <Pressable style={styles.container} onPress={() => {
            navigation.navigate('PostDetail', {
                post: post,
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
                <Text style={styles.title} numberOfLines={2}>{post.title}</Text>
                <Text style={styles.price}>RM {post.price}/month</Text>
                <Text style={styles.location}>Area: {post.location}</Text>
                <View style={styles.room}>
                    <Ionicons name="bed-outline" size={15} />
                    <Text style={styles.type}>{post.type}</Text>
                </View>
                <Pressable
                    style={styles.button}
                    onPress={() => {
                        navigation.navigate('EditPost', {
                            post: post,
                        });
                    }} >
                    <Text style={{color: 'blue', fontSize: 11}}>Edit Info</Text>
                </Pressable>
            </View>
        </Pressable>
    )
};

const styles = EStyleSheet.create({
    container: {
        marginTop: '0.45rem',
        marginBottom: '0.45rem',
        marginLeft: '0.6rem',
        marginRight: '0.6rem',
        borderRadius: 10,
        elevation: 5,
        backgroundColor: 'white',
        flexDirection: 'row',
    },

    posts: {
        padding: '0.32rem',
    },  

    postImage: {
        width: Dimensions.get('window').width * 0.45,
        resizeMode: 'cover',
        borderRadius: 10,
        height: Dimensions.get('window').height * 0.23,
        
    },

    postInfo: {
        marginLeft: '0.32rem',
        paddingTop: '0.64rem',
        width: '43%',
    },
    
    title: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: 'bold',
    },

    price: {
        fontWeight: 'bold',
        color: 'orange',
        fontSize: 14,
        marginTop: '0.5rem',
    },

    location: {
        marginTop: '0.32rem',
        fontSize: 12,
        fontStyle: 'italic',
        color: 'grey',
    },

    room: {
        marginTop: '0.63rem',
        flexDirection: 'row',
    },

    type: {
        fontSize: 12,
        color: '#504A4B',
        marginLeft: '0.32rem',
    },

    button: {
        width: '35%',
        alignItems: 'center',
        marginTop: '105%',
        marginLeft: '70%',
        position: 'absolute',
    },
})

export default Post;
