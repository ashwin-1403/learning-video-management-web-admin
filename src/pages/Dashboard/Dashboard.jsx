/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./dashboard.scss";

import userIcon from "../../assets/img/UserIcon.png";
import MainLogo from "../../assets/img/MainLogo.png";
import Humburger from "../../assets/img/burgarIcon.png";
import { allRoutes } from "../../routes/path";

import AssignmentSvc from "../../Components/SVGComponent/AssignmentSVC";
import CategorySVC from "../../Components/SVGComponent/CategorySVC";
import StudentSVC from "../../Components/SVGComponent/StudentSVC";
import VideoSVC from "../../Components/SVGComponent/VideoSVC";

function Dashboard({ isUser, setIsUser, children }) {
  const [show, setShow] = useState(false);
  const [isShown, setIsShown] = useState(false);
  const navigate = useNavigate();
  const profileSubDivRef = useRef(null);
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileSubDivRef.current &&
        !profileSubDivRef.current.contains(event.target)
      ) {
        // Click occurred outside of profileSubDiv and the component is shown, close it
        setIsShown(false);
      }
    };

    // Add event listener to handle outside clicks
    document.addEventListener("mousedown", handleOutsideClick);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleClick = () => {
    // Toggle shown state
    setIsShown((current) => !current);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLogin");
    setIsUser(false);
    setIsShown(false);
    navigate(allRoutes.login);
  };

  return (
    <>
      {isUser && (
        <div className={`sidebar ${show ? "close" : ""}`}>
          <div className="logo-details">
            <img src={MainLogo} className="mainLogo" alt="" />

            <span className="logo_name">ZAAC</span>
          </div>

          <ul className="nav-links">
            <li>
              <NavLink to={allRoutes.category}>
                <div className="d-flex align-items-center">
                  <CategorySVC />
                  <span className="link_name">Categories</span>
                </div>
              </NavLink>
            </li>

            <li>
              <NavLink to={allRoutes.videoList}>
                <div className="d-flex align-items-center">
                  <VideoSVC />
                  <span className="link_name">Videos</span>
                </div>
              </NavLink>
            </li>
            <li>
              <NavLink to={allRoutes.student}>
                <div className="d-flex align-items-center">
                  <StudentSVC />
                  <span className="link_name">Students</span>
                </div>
              </NavLink>
            </li>

            <li>
              <NavLink to={allRoutes.assignment}>
                <div className="d-flex align-items-center">
                  <AssignmentSvc />
                  <span className="link_name">Assignments</span>
                </div>
              </NavLink>
            </li>
          </ul>
        </div>
      )}

      <section className={`${isUser && "home-section"}`}>
        {isUser && (
          <div className="headerContentSec">
            <div className="home-content">
              <div
                tabIndex="0"
                role="button"
                onClick={() => setShow(!show)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setShow(!show);
                  }
                }}
              >
                <img className="bx bx-menu" src={Humburger} alt="" />
              </div>
              <div className="headerIconsSec">
                <button
                  className="profileLogoutBtn"
                  type="button"
                  onClick={handleClick}
                >
                  <img className="profileLogoutIcon" src={userIcon} alt="" />
                </button>
                {isShown && (
                  <div className="profileSubDiv" ref={profileSubDivRef}>
                    <button
                      className="logOut"
                      onClick={handleLogout}
                      type="button"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="commonBG">{children}</div>
      </section>
    </>
  );
}
export default Dashboard;
