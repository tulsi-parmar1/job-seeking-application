
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import style from "../../module/Profile.module.css";
import { toast } from "react-toastify";
import { FaSchool } from "react-icons/fa";
import { IoAddOutline } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { userAction } from "../../Slices/userSlice";
import { useDispatch } from "react-redux";
import { FaBookmark } from "react-icons/fa";
import Sidebar from "../Layout/Sidebar";

const Profile = () => {
    const { isAuthorized } = useSelector(state => state.user);
    const [degree, setDegree] = useState('');
    const [tenth, setTenth] = useState('');
    const [twelth, setTwelth] = useState('');
    const [sdegree, setSDegree] = useState('');
    const [stenth, setSTenth] = useState('');
    const [stwelth, setSTwelth] = useState('');
    const [edegree, setEDegree] = useState('');
    const [etenth, setETenth] = useState('');
    const [etwelth, setETwelth] = useState('');
    const [skills, setSkills] = useState('');
    const [about, setAbout] = useState('');
    const [hidden, setHidden] = useState(true);
    const { users } = useSelector(state => state.user); 
    const [profile, setProfile] = useState();
    const [displayProfile, setDisplayProfile] = useState(null);
    const {profilee}=useSelector(state=>state.user);
    const navigate = useNavigate();
    const dispatch=useDispatch();
    // Fetch profile and profile picture on component mount
    useEffect(() => {
        if (!isAuthorized) {
            navigate('/');
        }

        const getInfo = async () => {
            try {
                const { data } = await axios.get('http://localhost:4000/api/profile/getInfo', { withCredentials: true });
                setProfile(data.profile);
                if (data.profile) {
                    // Initialize form fields with existing profile data
                    setDegree(data.profile.education.degree.name || '');
                    setTenth(data.profile.education.tenth.name || '');
                    setTwelth(data.profile.education.twelth.name || '');
                    setSDegree(data.profile.education.degree.startdate || '');
                    setSTenth(data.profile.education.tenth.startdate || '');
                    setSTwelth(data.profile.education.twelth.startdate || '');
                    setEDegree(data.profile.education.degree.enddate || '');
                    setETenth(data.profile.education.tenth.enddate || '');
                    setETwelth(data.profile.education.twelth.enddate || '');
                    setSkills(data.profile.skills.join(', ') || ''); 
                    setAbout(data.profile.about || '');
                }
            } catch (error) {
                toast.error(error.response.data.message);
            }
        }
        // const getProfile = async () => {
        //     try {
        //         const { data } = await axios.get(`http://localhost:4000/api/profile/getProfile`, { withCredentials: true });
        //         // setDisplayProfile(data.url);
        //         dispatch(userAction.setProfile(data.url));
        //         console.log(data.url);
        //     } catch (error) {
        //         toast.error(error.response.data.message);
        //     }
        // }
        const getProfile = async () => {
            try {
                const { data } = await axios.get(`http://localhost:4000/api/profile/getProfile`, { withCredentials: true });
                // setDisplayProfile(data.url);
                dispatch(userAction.setProfile(data.url));
                console.log(data.url);
            } catch (error) {
                toast.error(error.response.data.message);
            }
        }
        getInfo();
        getProfile();
    }, [isAuthorized, navigate]);

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('degree', degree);
        formData.append('tenth', tenth);
        formData.append('twelth', twelth);
        formData.append('sdegree', sdegree);
        formData.append('stenth', stenth);
        formData.append('stwelth', stwelth);
        formData.append('edegree', edegree);
        formData.append('etenth', etenth);
        formData.append('etwelth', etwelth);
        formData.append('skills', skills.split(',').map(skill => skill.trim())); // Convert array to JSON string
        formData.append('about', about);

        try {
            const response = await axios.post('http://localhost:4000/api/profile/postInfo', formData, {
                withCredentials: true,
            });   
            toast.success(response.data.message);
         
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const handleOnClick = () => {
        setHidden(!hidden);
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0]; // Get the file directly
        const yess = confirm('Are you sure you want to upload this file?');
        if (yess) {
            const fm = new FormData();
            fm.append('profile', file);
            try {
                const response = await axios.post('http://localhost:4000/api/profile/profileChange', fm, { withCredentials: true });
                // setDisplayProfile(response.data.profile); 
                dispatch(userAction.setProfile(response.data.profile));
                toast.success(response.data.message);
                console.log('after',response.data.user);
                dispatch(userAction.setUser(response.data.user));
            } catch (error) {
                toast.error(error.response.data.message);
            }
        }
    };  
    const handleSavedJobs=async(e)=>{
        navigate('/savedjobs');
    }
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    };
    return (
        <div>
            {/* <div className={style.sidebar}> */}
                    {/* <Sidebar></Sidebar> */}
        {/* </div> */}
        <div className={style.formcontainer} style={{margin:'20px 30px'}}>
            <div className={style.profile}>
                <div className={style.imageformate}>
                    {profilee ? <img src={`${profilee}`} alt="Profile" /> : <img src="profile.png" alt="Profile" />}
                </div>
                <p style={{fontWeight:'bold',fontSize:'26px'}} className={style.name}>{users.name}</p>
                <label htmlFor="file-input" className={style.addProfile} ><IoAddOutline /></label>
                <div className={style.info}>
                    <p><MdEmail />{users.email}</p>
                    <p>+91-{users.phone}</p>
                 
                </div>
                <input type="file" name="profile" onChange={handleFileChange} style={{ display: 'none' }} id="file-input" />
            </div>
          
            <div className={style.profileinfo}>
                
            {profile?.about && <>
                <hr style={{height:'10px',backgroundColor:'white'}}/>
                <h1 style={{marginTop:'20px'}}> About</h1>
              <div style={{borderRadius:'10px'}} className={style.about2}> 
                <div className={style.about}>
               
                {profile?.about && <p className={style.about}>{profile.about}</p>}
                </div>
                </div>
               
            </>}
                {profile?.skills.length>0 &&   <>
                    <hr style={{height:'10px',backgroundColor:'white'}}/>
                <h1  style={{marginTop:'20px'}}>Skills</h1>
                <div className={style.about2} style={{borderRadius:'10px'}}>
              <div className={style.skills}>
              {profile?.skills && <p className={style.skills}>{profile.skills.join(', ')}</p>} </div> 
              </div></>
                }
                {
                    (tenth || twelth || degree) &&
                    <>
                     <hr style={{height:'10px',backgroundColor:'white'}}/>
                     <h1 style={{marginTop:'10px'}}>education</h1>
                    </>
                }
                {tenth && <>
                <div style={{margin:'20px'}} className={style.tenth}>
                <FaSchool style={{fontSize:'35px'}}/>
                <div>
                <h4>Tenth</h4>
                <p >{tenth}</p>
                <p style={{fontSize:'15px'}}>{formatDate(stenth)} - {formatDate(etenth)}</p>
                </div>
                </div>
                </>}
                {twelth && <>
                <div style={{margin:'20px'}} className={style.tenth}>
                <FaSchool style={{fontSize:'35px'}}/>
                <div>
                <h5>Twelth</h5>
                <p>{twelth}</p>
                <p style={{fontSize:'15px'}}>{formatDate(stwelth)} - {formatDate(etwelth)}</p>
                </div>
                </div>
                </>}
                {degree && <>
                <div style={{margin:'20px'}} className={style.tenth}>
                <FaSchool style={{fontSize:'35px'}}/>
                <div>
                <h4>College</h4>
                <p >{degree}</p>
                <p style={{fontSize:'15px'}}>{formatDate(sdegree)} - {formatDate(edegree)}</p>
                </div>
                </div>
                </>}
                <hr style={{height:'10px',backgroundColor:'white'}}/>
                <div className={style.savedjobs}>
                    <FaBookmark style={{fontSize:'26px'}} />
                    <div>
                    <h3 onClick={handleSavedJobs} style={{display:'inline'}}>Saved Jobs </h3> 
                     <p>keep track of your favrioute jobs</p>
                   </div>

                </div>
            </div>

            <a onClick={handleOnClick} href="#"><h2 style={{ color: 'blue' }}>Add Profile section</h2></a>
            <form onSubmit={handleOnSubmit} className={`${style.form} ${hidden ? style.hidden : style.show}`}>
                <div className="about">
                    <h2>About</h2>
                    <textarea 
                        onChange={(e) => setAbout(e.target.value)} 
                        style={{ width: '100%', margin: '30px 0px' }} 
                        value={about}
                    />
                </div>
                <h2>Education</h2>
                <label htmlFor="degree-name">College Name:</label>
                <input
                    type="text"
                    name="degree"
                    id="degree-name"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                />
                <br />
                <label htmlFor="degree-startdate">Start Date:</label>
                <input
                    type="date"
                    name="startdate"
                    id="degree-startdate"
                    value={sdegree}
                    onChange={(e) => setSDegree(e.target.value)}
                />
                <br />
                <label htmlFor="degree-enddate">End Date:</label>
                <input
                    type="date"
                    name="enddate"
                    id="degree-enddate"
                    value={edegree}
                    onChange={(e) => setEDegree(e.target.value)}
                />
                <br /><br />

                <label htmlFor="tenth-name">School Name (10th):</label>
                <   input
                    type="text"
                    name="tenth"
                    id="tenth-name"
                    value={tenth}
                    onChange={(e) => setTenth(e.target.value)}
                />
                <br />
                <label htmlFor="tenth-startdate">Start Date:</label>
                <input
                    type="date"
                    name="startdate"
                    id="tenth-startdate"
                    value={stenth}
                    onChange={(e) => setSTenth(e.target.value)}
                />
                <br />
                <label htmlFor="tenth-enddate">End Date:</label>
                <input
                    type="date"
                    name="enddate"
                    id="tenth-enddate"
                    value={etenth}
                    onChange={(e) => setETenth(e.target.value)}
                />
                <br /><br />

                <label htmlFor="twelth-name">School Name (12th):</label>
                <input
                    type="text"
                    name="twelth"
                    id="twelth-name"
                    value={twelth}
                    onChange={(e) => setTwelth(e.target.value)}
                />
                <br />
                <label htmlFor="twelth-startdate">Start Date:</label>
                <input
                    type="date"
                    name="startdate"
                    id="twelth-startdate"
                    value={stwelth}
                    onChange={(e) => setSTwelth(e.target.value)}
                />
                <br />
                <label htmlFor="twelth-enddate">End Date:</label>
                <input
                    type="date"
                    name="enddate"
                    id="twelth-enddate"
                    value={etwelth}
                    onChange={(e) => setETwelth(e.target.value)}
                />
                <br /><br />

                <div>
                    <h2>Skills</h2>
                </div>
                <label htmlFor="skills">Comma Separated Skills:</label>
                <textarea 
                    onChange={(e) => setSkills(e.target.value)} 
                    style={{ margin: '14px 0px' }} 
                    value={skills}
                />
                <br />
                <button type='submit'>Add Info</button>
            </form>
        </div>
        </div>
    );
};

export default Profile;
