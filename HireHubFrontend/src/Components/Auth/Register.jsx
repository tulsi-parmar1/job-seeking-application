import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import { userAction} from "../../Slices/userSlice"; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import style from "../../module/Login.module.css"
function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { isAuthorized } = useSelector(state => state.user);
    const handleLogin=()=>{
        navigate('/login')
    }
    const handleRegister = async(e) => {
        e.preventDefault();
        try {
            const response =await axios.post("http://localhost:4000/api/user/register", { name, email, phone, password }, {
                withCredentials: true, headers: {
                    "Content-Type": "application/json",
                }
            });
            toast.success(response.data.message);
            setName("");
            setEmail("");
            setPhone("")
            setPassword("");
            dispatch(userAction.setIsAuthorized(true));
          
        } catch (error) {

            if (error.response) {
                // Server responded with a status other than 200 range
                // console.log('Error Response:', error.response); // Log the error response
                if (error.response.status === 400 && error.response.data.errors) {
                     // Show validation errors
                    toast.error(error.response.data.errors.join('\n'));
            
                } else {
                    toast.error(error.response.data.message);
                }
            } else if (error.request) {
                toast.error('no response from server');
            } else {
                // Something else happened in setting up the request
                toast.error('Error in setting up request')
            }
            dispatch(userAction.setIsAuthorized(false));
        }
    }
    useEffect(() => {
        if (isAuthorized) {
            navigate('/');
        }
    }, [isAuthorized, navigate]);
    return (
        <>
    
           
                <div className={style.container}>
                    <div className={style.img}>
                       
                        <img src="loginimg.png" alt="logo" />
                    </div>
                    <form action="">
                        <div className={style.inputTag}>
                        <h2 className={style.label} style={{marginBottom:'20px'}}>Create new Account </h2>

                            <div>
                                <label >name</label>
                                <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div>
                                <label >email</label>
                                <input type="text" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div>
                                <label >Phone</label>
                                <input type="number" name="phone" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </div>
                            <div>
                                <label >password</label>
                                <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <div>
                                <input type="submit" name="submit" onClick={handleRegister} className={style.lgnbtn}/>
                            </div>
                            <div>Already have an Account? <a onClick={handleLogin}>Login</a></div>
                        </div>
                    </form>
                </div>
            
        
        </>
    )
}
export default Register;