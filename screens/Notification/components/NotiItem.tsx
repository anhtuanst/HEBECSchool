import { observer } from "mobx-react";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import notiStore from "../../../store/NotificationStore";
import { convertDate } from "../../../types/DateTime";
import { width } from "../../../utils/dimensions";

export const NotificationItem = observer(({navigation,item}:any) => {
    return (
        <TouchableOpacity
        onPress={() => {
            if(item.type == 'ORDER'){
                navigation.navigate("History")
                item.isSeen? null:notiStore.seenNoti(item.id)
            }
            if(item.type == 'NEWS'){
                navigation.navigate('News',{
                    id: item.news.id,
                  })
                item.isSeen? null:notiStore.seenNoti(item.id)
            }

        }}

        style = {styles.container}>
            <View style = {styles.left}>
                <Image
                    source = {require("../../../assets/icons/Noti.png")}
                    style = {item.isSeen?styles.imgSeened:styles.imgUnseen}
                />
            </View>
            <View style = {styles.right}>
                <Text style = {item.isSeen? styles.titleSeened :styles.title}>{item.title}</Text>
                <Text
                numberOfLines={2}
                style = {item.isSeen?styles.contentSeened: styles.content}>{item.content}</Text>
                <Text style = {styles.time}>{convertDate(item.createdAt)}</Text>
            </View>
        </TouchableOpacity>
    );
}
);
const styles = StyleSheet.create({
    item: {
        backgroundColor: "#fff",
        flex: 1,
    },
   
    container: {
        flexDirection: "row",
        marginHorizontal: 20,
        height: 85,
    },
    left: {
        flexDirection: "row",
        width: 40,
        alignItems: "flex-end",
    },
    right: {
        marginLeft: 10,
        alignItems: "flex-start",
        flexDirection: "column",
        width: width - 90,
    },
    title: {
        fontSize: 16,
        color: "#231F20",
        fontWeight: "500",
    },
    titleSeened: {
        fontSize: 16,
        color: "#9E9E9E",
        fontWeight: "400",
    },
    content: {
        fontSize: 14,
        color: "#231F20",
        marginVertical: 5,
    },
    contentSeened: {
        fontSize: 14,
        color: "#9E9E9E",
        marginVertical: 5,
    },
    time: {
        fontSize: 12,
        color: "#9E9E9E",
    },
    imgSeened: {
        width: 40,
        resizeMode: "contain",
        top: -10
    },
    imgUnseen: {
        width: 40,
        tintColor: "#489620",
        resizeMode: "contain",
        top: -10
    },
});
