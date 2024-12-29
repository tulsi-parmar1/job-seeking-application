// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import { FaFacebook } from "react-icons/fa";
// import { FaInstagram } from "react-icons/fa";
// import { FaYoutube } from "react-icons/fa";
// import style from "../../module/Footer.module.css"

// function Footer() {
//     const { isAuthorized } = useSelector(state => state.user);
//     return (
//         <>

//
//         <div className={style.one}>
//                                 <h1 >Shop Non-Stop on Meesho</h1>
//                                 <p>Trusted by more than 1 Crore Indians
//                                     Cash on Delivery | Free Delivery</p>
//                                 <div className={style.image}>
//                                     <img src="g.webp" alt="" style={{height:'50px', width:'170px;'}}/>&nbsp; &nbsp;
//                                     <img src="g2.webp" alt="" style={{height:'50px', width:'170px;'}}/>
//                                 </div>
//         </div>

//         <div className={style.two}>
//                 <div className={style.link}>
//                     <div><a href="">Careers</a><br/></div>
//                     <div><a href="">Became a supplier</a><br/></div>
//                     <div> <a href="">Hall od frame</a><br/></div>
//                      <div> <a href="">Sitemap</a><br/></div>
//                 </div>
//         </div>

//         <div className={style.three}>
//             <div className={style.link2}>
//                 <div><a href="">Legal and Polices</a></div>
//                 <div><a href="">Meesho tech Blog</a></div>
//                 <div><a href="">Notices and Returns</a></div>

//             </div>
//         </div>
//         <div className={style.four}>
//             <h3>Reach out to us</h3>
//             <div className={style.icon}>
//                <a className={style.none} href="">      <Link to="/" target="_blank"><FaFacebook /></Link> </a>
//                 <a href=""> <Link to="/" target="_blank"><FaInstagram /></Link></a>
//                <a href=""> <i class="fa-brands fa-twitter"></i></a>
//                 <a href="https://www.linkedin.com/in/tulsi-parmar-76a865290/"><i class="fa-brands fa-linkedin"></i></a>
//                 <a href=""><i class="fa-brands fa-youtube"></i></a>
//             </div>
//         </div>

//         <div className={style.five}>
//          <h2>Contact Us</h2>
//          <p>Fashnear Technologies Private Limited,
//             CIN: U74900KA2015PTC082263
//             06-105-B, 06-102, (138 Wu) Vaishnavi Signature, No. 78/9, Outer Ring Road, Bellandur, Varthur Hobli, Bengaluru-560103, Karnataka, India
//             E-mail address: query@meesho.com
//             © 2015-2024 Meesho.com</p>
//         </div>

//    </div>
//         </>
//     )
// }
// export default Footer;
import React from "react";
import style from "../../module/Footer.module.css";
import { useSelector } from "react-redux";

function Footer() {
  const { isAuthorized } = useSelector((state) => state.user);
  return (
    <div
      style={{ position: "sticky", bottom: "0px" }}
      className={`${!isAuthorized && style.footerHide}`}
    >
      <footer>
        <div className={style["footer-container"]}>
          <div className={style["footer-section"]}>
            <h3>HireHub</h3>
            <p>Your go-to platform for job opportunities.</p>
          </div>

          <div className={style["footer-section"]}>
            <h4>Quick Links</h4>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/job/getall">Jobs</a>
              </li>
              <li>
                <a href="/about">About Us</a>
              </li>
              <li>
                <a href="/contact">Contact Us</a>
              </li>
              <li>
                <a href="/faq">FAQ</a>
              </li>
            </ul>
          </div>

          <div className={style["footer-section"]}>
            <h4>Contact Us</h4>
            <p>Email: support@hirehub.com</p>
            <p>Phone: +1 123 456 7890</p>
          </div>

          <div className={style["footer-section"]}>
            <h4>Legal</h4>
            <ul>
              <li>
                <a href="/privacy">Privacy Policy</a>
              </li>
              <li>
                <a href="/terms">Terms of Service</a>
              </li>
            </ul>
          </div>

          <div className={style["footer-section"]}>
            <h4>Follow Us</h4>
            <a href="#">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="#">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#">
              <i className="fab fa-facebook"></i>
            </a>
          </div>
        </div>
        <p className={style["footer-bottom"]}>
          &copy; 2024 HireHub. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Footer;
