import style from "../../module/Loader.module.css";
import React from "react";
// import 'bootstrap/dist/css/bootstrap.min.css';

const Loader = () => (
  <>
    <div
      class={style.loader}
      style={{ marginTop: "100px", marginBottom: "200px" }}
    ></div>
  </>
);

export default Loader;
