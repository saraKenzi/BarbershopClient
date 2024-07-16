import axios from "axios";

let baseUrl = "https://localhost:44369/api/user";

const loginInServer = async (user) => {
    try {

        const response = await axios.post(`${baseUrl}/Login`,
            user,
            { withCredentials: true }  // כולל את הקוקיז בבקשה
        );
        return response;
    }
    catch (error) {
        console.error('Sign up error:', error);
        throw error;
    }

}

const signUpInServer = async (user) => {
    try {
        const response = await axios.post(`${baseUrl}/AddUser`, user,
            { withCredentials: true }  // כולל את הקוקיז בבקשה

        );
        return response;
    } catch (error) {
        console.error('Sign up error:', error);
        throw error;
    }
};


const logOutInServer = async() => {
    try {
        const response = axios.get(`${baseUrl}/Logout`,
            { withCredentials: true }  // כולל את הקוקיז בבקשה

        );
        return response;
    }
    catch (error) {
        console.error('Sign up error:', error);
        throw error;
    }
}

const getUserDetailsByUserId= async(userId)=>{
    try{
const response= await axios.get(`${baseUrl}/getUserDetailsByUserId/${userId}`,
    { withCredentials: true }  // כולל את הקוקיז בבקשה

);
return response;
    }
    catch(error){
        console.error('get user details by user id error:', error);
        throw error;
    }
}
const getUserIdByFirstName = async (userName) => {
    try {

        const response = await axios.get(`${baseUrl}/getUserIdByFirstName/${userName}`,
            { withCredentials: true } 

        );
        return response.data;
    }

    catch (error) {
        console.error('get users id by firstName error:', error);
        throw error;

    }
}

export { signUpInServer, loginInServer, logOutInServer,getUserDetailsByUserId,getUserIdByFirstName };
