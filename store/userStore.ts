import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeAutoObservable } from "mobx";
import { action, computed, observable,  } from "mobx";
import { Alert, NativeModules } from "react-native";
import { NotificationService } from "../plugins/notificationService";
import request from "../utils/request";
export const apiUser = {
    login: (username: string, password: string) => request({
        url: "/v1/customer/auth/login",
        method: "POST",
        data: {
            username: username,
            password: password
        }
    }),
    logout: () => request({
        url: "/v1/customer/auth/logout",
        method: "POST"
    }),
    updatePassword: (password: string, newPassword: string) => request({
          url: "/v1/customer/auth/password/update",
          method: "POST",
            data: {
                oldPassword: password,
                newPassword: newPassword
            }
    }),
    getInfo: ({fcmToken}:any) => request({
        url: "/v1/customer/auth/profile",
        method: "GET",
        headers: {
            fcmToken
        }
    }),
    register: (username: string, password: string, name: string) => request({
        url: "v1/customer/auth/signup",
        method: "POST",
        data: {
            username: username,
            password: password,
            name: name
        }
    }),

};

class Store{
    constructor(){
        makeAutoObservable(this)
}
@observable info: any = {};

@observable private _token = null;
@observable isLoading: boolean = false;
@observable _isLoadingLogin: boolean = false;
@observable _messageError: string = "";
@observable _messageChangePassword: string = "";

@computed get token(){
    return this._token;
}

 @computed get isLoadingLogin(){
    return this._isLoadingLogin;
}
@computed get messageError(){
    return this._messageError;
}
@computed get messageChangePassword(){
    return this._messageChangePassword;
}

@action
async setToken(token: any){
    this._token = token;
    await AsyncStorage.setItem("token", token);
}

@action
async login (username: string, password: string){
    this.setIsLoadingLogin(true);
    await apiUser.login(username, password).then(async res => {
        this.setToken(res.data.token);
        this.getInfo();
    }
    ).catch(err => {
        this.setMessageError(err.response.data.message);
    }
    );
    this.setIsLoadingLogin(false);
}
@action
async getInfo(){
    this.isLoading = true;
    const fcmToken = await AsyncStorage.getItem("fcmToken");
   
    
    const res = await apiUser.getInfo({fcmToken});
    console.log("FCMMMM",res.data);
    this.info = res.data;
    NotificationService.setBadge(res.data.totalNotifyNormal);
    this.isLoading = false;
}
@action
async logout(){
    await apiUser.logout();
    this.resetDataUser();
}
@action
async updatePassword(password: string, newPassword: string){
    await apiUser.updatePassword(password, newPassword).then(res => {
       this.setMessageChangePassword(res.data.message);
        this.logout();
        this.resetDataUser();
    }
    ).catch(err => {
        this.setMessageChangePassword(err.response.data.message);
    }
    );
   
}
@action
async resetDataUser(){
    await AsyncStorage.removeItem("token");
    NotificationService.setBadge(0);
    this.setToken(null);
}

@action setIsLoadingLogin(isLoading: boolean){
    this._isLoadingLogin = isLoading;
}
@action setMessageError(messageError: string){
    this._messageError = messageError;
}
@action async setMessageChangePassword(messageChangePassword: string){
    this._messageChangePassword = messageChangePassword;
}

}
const userStore = new Store();
export default userStore;