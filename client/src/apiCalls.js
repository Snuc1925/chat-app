import axios from 'axios';

export const getUserData = async (auth, userId) => {
    // console.log(userId);
    const userData = await axios.get(`http://localhost:8000/api/user/${userId}`, {
        headers: {
            'x-access-token': auth.accessToken,
        }
    }).then((res) => { 
        // console.log(res.data);
        return res.data;
    });

    return userData;
}