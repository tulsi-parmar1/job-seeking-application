import Sidebar from "../Layout/Sidebar";
import style from "../../module/Profile.module.css"
import { Outlet } from "react-router-dom";
function Profilemain(){
    return(
        <>
            <div className={style.maincontainer}>
                <div className={style.sidebar}>
                <Sidebar></Sidebar>
                </div>
                <div className={style.outlet}>
                <Outlet></Outlet>
                </div>
                
                {/* <Profile></Profile> */}
            </div>
        </>
    )
}
export default Profilemain;