import Page404 from "../../../public/404.jpg";
import style from "../../module/pageNotFound.module.css";
import { Link } from "react-router-dom";
function NotFound() {
  return (
    <>
      {/* <iframe src={Page404} className={style.pageNotFound}></iframe> */}
      <div className={style.pageNotFound}></div>
      <div className={style.NotFound}>
        <h1 className={style.errorCode}>404</h1>
        <p className={style.errorMessage}>
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link to="/" className={style.homeButton}>
          Go Back Home
        </Link>
      </div>
    </>
  );
}
export default NotFound;
