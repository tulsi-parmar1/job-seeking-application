import { useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { VscAccount } from "react-icons/vsc";
import { NavLink, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { TfiMenu } from "react-icons/tfi";
import { GiHamburgerMenu } from "react-icons/gi";
import { userAction } from "../../Slices/userSlice";
import { toast } from "react-toastify";
import style from "../../module/Navbar.module.css";
import { useEffect } from "react";
function NavBar() {
    const [scrolling, setScrolling] = useState(false);
    const [displayProfile,setDisplayProfile]=useState(null);
    const [show, setShow] = useState(false);
    const { isAuthorized } = useSelector(state => state.user);
    // const {users}=useSelector(state=>state.user);
    const {users}=useSelector(state=>state.user);
    const userId=users._id;
    const {profilee}=useSelector(state=>state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // useEffect(() => {
    //   const handleScroll = () => {
    //     //vertically scroll mate scrollY
    //     if (window.scrollY > 0) {
    //       setScrolling(true);
    //     } else {
    //       setScrolling(false);
    //     }
    //   };
    //   const getProfile = async () => {
    //     try {
    //         const { data } = await axios.get('http://localhost:4000/api/profile/getProfile', { withCredentials: true });
    //         setDisplayProfile(data.url);
    //         dispatch(userAction.setProfile(data.url));
    //     } catch (error) {
    //         toast.error(error.response.data.message);
    //     }
    // }
    // const fetchUser = async () => {
    //     try {
    //       const response = await axios.get("http://localhost:4000/api/user/getUser", { withCredentials: true });
    //       dispatch(userAction.setUser(response.data.user));
    //       dispatch(userAction.setIsAuthorized(true));
    //     } catch (err) {
    //       console.error('Error fetching user:', err); // Handle error
    //       dispatch(userAction.setIsAuthorized(false));
    //     }
    //   };
    //     fetchUser();
    //    getProfile();
    //   //user scroll kre tyare j aa call thay
    //   window.addEventListener('scroll', handleScroll);
  
    //   //jyre component unMount thay tyare aa clean-up thay jay
    //   return () => {
    //     window.removeEventListener('scroll', handleScroll);
    //   };
     
    // }, []);

    useEffect(() => {
        const fetchUserDataAndProfile = async () => {
          try {
            // Fetch user data
            // const userResponse = await axios.get("http://localhost:4000/api/user/getUser", { withCredentials: true });
            // dispatch(userAction.setUser(userResponse.data.user));
            // dispatch(userAction.setIsAuthorized(true));
            
            // Fetch profile data after user data
            console.log(userId);
            console.log(users);
            const profileResponse = await axios.get(`http://localhost:4000/api/profile/getProfile`, { withCredentials: true });
            
            setDisplayProfile(profileResponse.data.url);
            dispatch(userAction.setProfile(profileResponse.data.url));
            console.log(profileResponse.data.url);
          } catch (err) {
            console.error('Error fetching data:', err);
            console.log(err);
            dispatch(userAction.setIsAuthorized(false));
          }
        };
      
        fetchUserDataAndProfile();
      
        const handleScroll = () => {
          if (window.scrollY > 0) {
            setScrolling(true);
          } else {
            setScrolling(false);
          }
        };
      
        window.addEventListener('scroll', handleScroll);
      
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, []);
      



    const handleLogout = async () => {

        try {
            const response = await axios.get("http://localhost:4000/api/user/logout", { withCredentials: true });
            dispatch(userAction.setIsAuthorized(false));
            navigate('/login');
        }
        catch (err) {
            console.log(response.data)
            dispatch(userAction.setIsAuthorized(true));
        }
    }
    const handleOnClick = () => {
        setShow(!show);
    }
    const handlepostjob=()=>{
        navigate('/job/post');
    }
    return (
        <>
              <nav className={`${style.navbar} ${scrolling ? style.onscroll : ''} ${!isAuthorized &&  style.noneNavbar}` }>
                <div className={style.logo}>
                    {/* <img src="logo2.png" alt=""  /> */}
                    <h1>HIREhub</h1>
                    {/* <img src="logo.png" alt="" /> */}
                </div>
                <div className={style.menu}>
                    {show ? <IoClose className={style.icon1} onClick={handleOnClick}></IoClose> : <TfiMenu className={style.icon2} onClick={handleOnClick}></TfiMenu>}
                    <ul className={`${style.menuitems} ${show && style.menuopen}`} onClick={() => setShow(false)}>
                        <li>
                            <NavLink to='/' className={({ isActive }) =>
                                isActive ? style.active : ""
                            }>Home</NavLink>
                        </li>
                        <li>
                            <NavLink to='/job/getall' className={({ isActive }) =>
                                isActive ? style.active : ""
                            }>jobs</NavLink>
                        </li>
                        <li className={style.profilecontainer}>
                            <NavLink to='/profile' className={({ isActive }) =>
                                isActive ? style.active : ""
                            }>
                             { profilee ? <img src={`${profilee}`} alt="profilePic" /> :  <VscAccount style={{marginTop:'10px',fontSize:'26px'}}/>  }
                               {/* {displayProfile ? <img src={`${displayProfile}`} alt="profilePic" /> :  <VscAccount style={{marginTop:'10px',fontSize:'26px'}}/>} */}
                            </NavLink>
                        </li>
                        <div className={style.btns}>
                        <button onClick={handlepostjob} className={style.postjob}>Post Job</button>
                        <button onClick={handleLogout} className={style.logoutbtn}>Logout</button>
                        </div>
                    </ul>     
                   
                </div>
            </nav>


        </>
    )
}
export default NavBar;