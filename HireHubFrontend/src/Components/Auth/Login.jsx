import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import { userAction} from "../../Slices/userSlice"; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import style from "../../module/Login.module.css"
function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { isAuthorized } = useSelector(state => state.user);
    const handleRegister=async(e)=>{
            navigate('/register')
    }
    const handleLogin = async(e) => {
        e.preventDefault();
        try {
            const { data } =await axios.post("http://localhost:4000/api/user/login", { email,  password }, {
                withCredentials: true, headers: {
                    "Content-Type": "application/json",
                }
            });
            toast.success(data.message);
            setEmail("");
            setPassword("");
            dispatch(userAction.setIsAuthorized(true));
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
            dispatch(userAction.setIsAuthorized(false)); 
        }
    }
        
        useEffect(()=>{
            if (isAuthorized) {
                navigate('/');
            }
        },[isAuthorized])
    return (
        <>
  
           
                <div className={style.container}>
                    <div className={style.img}>
                        <img src="loginimg.png" alt="logo" />
                    </div>
                
                    <form action="">
                      <h2 className={style.label} style={{marginBottom:'20px'}}>Login As</h2>
                        <div className={style.inputTag}>
                          
                            <div>
                                <label >Email</label>
                                <br />
                                <input type="text" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                          
                            <div>
                                <label >Password</label>
                                <br />
                                <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <div>
                                <input type="submit" name="submit" onClick={handleLogin} className={style.lgnbtn} value="Login"/>
                            </div>
                            <div style={{marginTop:'20px'}}>
                                don't have an account ? <a onClick={handleRegister} >Register</a>
                            </div>
                        </div>
                    </form>
                    
                </div>
            
        
        </>
    )
}
export default Login;