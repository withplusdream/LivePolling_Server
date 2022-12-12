import axios from 'axios'


export const adminLogin = async (data) => {
    var res = await axios.get(`https://plussol.wplusedu.co.kr/api/login`, {
            params:{
                email: data.email,
                password: data.password,
                game_id: 11,
            }
        });
    
    return res.data
}