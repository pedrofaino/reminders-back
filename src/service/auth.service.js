import axios from 'axios';
import qs from 'qs';
import {User} from '../models/User.js';

export async function getGoogleOAuthTokens({code}){
    const url = 'https://oauth2.googleapis.com/token'
    const values = {
        code,
        clientId:process.env.CLIENT_ID,
        client_secret:process.env.CLIENT_SECRET,
        redirect_uri:process.env.CLIENT_URL,
        grant_type: 'authorization_code'
    };
    try{
        const res = await axios.post(url,qs.stringify(values),{
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return res.data
    }
    catch(error){
        console.log(error.response.data.error, "Error fetch google tokens")
        throw new Error(error.message)
    }
}

export async function getGoogleUser({id_token, access_token}){
    try{
        const res = await axios.get(`https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${access_token}`,{
            headers:{
                'Authorization': `Bearer ${id_token}`
            }})
        return res.data;
    }catch(error){
        console.log(error,"Error fetch user google.");
    }
}

export async function findAndUpdateUser(query,update,options = {}) {
    return User.findOneAndUpdate(query, update, options);
}