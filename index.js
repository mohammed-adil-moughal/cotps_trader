require('dotenv').config()
const request = require('request')
const axios = require('axios')

const loginUser = async (phoneNumber, password) => {
    const options = {
        method: 'POST',
        url: 'https://www.cotps.com:8443/api/mine/sso/user_login_check',
        data: {
            mobile: "+254" + phoneNumber,
            password,
            type: "mobile"
        }
    }
    const loginInfo = await axios(options)
    return loginInfo.headers.authorization
}


const getBalance = async (token) => {
    const options = {
        method: 'POST',
        url: 'https://www.cotps.com:8443/api/mine/sso/getinfo',
        headers: {
            'Authorization': 'Bearer ' + token
        },
    }
    const userInfo = await axios(options)
    return userInfo.data.userinfo.balance;
}

const getTransactionInfo = async (token) => {
    const options = {
        method: 'GET',
        url: 'https://www.cotps.com:8443/api/mine/user/getDealInfo',
        headers: {
            'Authorization': 'Bearer ' + token
        },
    }
    const transactionInfo = await axios(options)

    return transactionInfo.data.userinfo;
}

const getRandomTrade = async (token) => {
    const options = {
        method: 'GET',
        url: '    https://www.cotps.com:8443/api/mine/user/createOrder',
        headers: {
            'Authorization': 'Bearer ' + token
        },
    }
    const orderInfo = await axios(options)
    return orderInfo.data
}

const submitOrder = async (token, orderId) => {
    const options = {
        method: 'GET',
        url: 'https://www.cotps.com:8443/api/mine/user/submitOrder?orderId=' + orderId,
        headers: {
            'Authorization': 'Bearer ' + token
        },
    }
    const submitedOrder = await axios(options)
    return submitedOrder.data
}

const main = async () => {
    let password = process.env.PASSWORD;
    let phoneNumber = process.env.PHONENUMBER;

    let token = await loginUser(phoneNumber, password);
    const balance = await getBalance(token);

    const transactionInfo = await getTransactionInfo(token);
    
    //compare minimum balance allowed for trade
    if (balance > transactionInfo.deal_min_balance) {
        orderDetails = await getRandomTrade(token)
        submitResponse = await submitOrder(token, orderDetails.data.orderId)
        if (submitResponse.code == 200) {
            console.log("Trade Placed")
        }
    } else {
        console.log("No funds to use")
    }
}

main()