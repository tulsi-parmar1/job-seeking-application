import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { GiCoinsPile } from "react-icons/gi";

const JobsByCount=()=>{
    const category=useParams();
    const name=category.category;
    console.log(name);
    // useEffect(()=>{
    //     try {
    //         axios.get(`http://localhost:4000/api/job/jobsByCategory/${name}`).then((res)=>{
    //             console.log(res.data);
    //         })
    //     } catch (error) {
    //             console.log(error)
    //     }
      
    // },[])
    
    return(
        <>
        <h1>hey</h1>
        </>
    )
}
export default JobsByCount;