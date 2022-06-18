import { observer } from "mobx-react"
import React from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { PriceText } from "../../../components/Price"
import historyOrdersStore from "../../../store/HistoryStore"
import { width } from "../../../utils/dimensions"

export const convertDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const day = date.getDate().toFixed(0).toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
 return `${hour}:${minute} ${day}/${month}/${year}`;
}
export const getStatus = (status: string) => {
    switch (status) {
        case "PENDING":
            return "Chờ xác nhận"
        case "PACKAGE":
            return "Đóng gói"
        case "DELIVERING":
            return "Đang vận chuyển"
        case "COMPLETE":
            return "Đã giao"
        case "CANCEL":
            return "Đã hủy"
        default:
            return "Chờ xác nhận"
    }
}

export const ItemOrder = observer(({data, navigation} : any) => {
    
    const getQuantity = (orderDetails: any) => {
        let quantity = 0;
        orderDetails.forEach((item: any) => {
            quantity += item.quantity;
        })
        return quantity;
    }
    return (
        <View style = {styles.container}>
            <TouchableOpacity
            onPress={() => navigation.navigate("OrderDetail", {data: data})}
            style = {styles.content}>
                <View style = {styles.icon}>
                    <Image style = {styles.icon} source={require("../../../assets/icons/BoxShipping.png")} />
                </View>
                <View style = {styles.Detail}>
                    <View style = {styles.DetailTitle}>
                        <Text style = {styles.textTitle}>{data.code}</Text>
                        <PriceText price = {data.moneyFinal} style = {styles.textPrice}/>
                    </View>
                    <View style = {styles.row}>
                        <Text style = {styles.textDetail}>{convertDate(data.createdAt)}</Text>
                    </View>
                    <View style = {styles.row}>
                        <Text style = {styles.textDetail}>Giao đến:</Text>  
                        <Text
                        numberOfLines={1}
                        style = {styles.textValue}>{data.address +", "+ data.addressWard.pathWithType}</Text>
                    </View>
                    <View style = {styles.DetailStatus}>
                        <View style = {styles.row}>
                            <Text style = {styles.textDetail}>Số lượng:</Text>
                            <Text style = {styles.textValue}>{getQuantity(data.orderDetails)+" sản phẩm"}</Text>
                        </View>
                        <View style = {styles.dot}/>
                        <Text style = {data.status =="CANCEL"? styles.textStatusCancel: styles.textStatus}>{getStatus(data.status)}</Text>
                    </View> 

                </View>
            </TouchableOpacity>
            <View style = {styles.line}/>
        </View>
    )
}
)
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        padding: 20,
    },
    content: {
        flexDirection: "row",
        marginBottom: 15,
    },
    icon: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    Detail: {
        flex: 1,
        flexDirection: "column",
    },
    DetailTitle: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5,
        alignItems: "center",
    },
    textTitle: {
        fontSize: 18,
        fontWeight: "500",
        color:"#000",
    },
    textDetail: {
        fontSize: 14,
        fontWeight: "400",
        color:"#9E9E9E",
        alignItems: "center",
    },
    textValue: {
        fontSize: 14,
        fontWeight: "500",
        color:"#9E9E9E",
        marginLeft: 5,
        maxWidth: width - 140,
    },
    DetailStatus: {
        flexDirection: "row",
        alignItems: "center",
    },
    textStatus: {
        fontSize: 14,
        fontWeight: "500",
        color:"#489620",
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#9E9E9E",
        marginHorizontal: 10,
    },
    line: {
        borderBottomWidth: 1,
        borderBottomColor: "#C9C2C0",
    },
    textPrice: {
        fontSize: 16,
        fontWeight: "700",
        color:"#F44336",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },
    textStatusCancel: {
        fontSize: 14,
        fontWeight: "500",
        color:"#F44336",
    },
}
)