import React, { useContext, useState, useEffect } from "react";
import { ActContext } from "../../App";
import { useNavigate, NavLink } from "react-router-dom";
import "../../styles/navbar.scss";
import axios from "axios";
import { iconButton } from "./style";
import { CloseRounded, LogoutRounded, MenuRounded } from "@mui/icons-material";
import { Tooltip, IconButton } from "@mui/material";
import { socket } from "../../socket";
import Notification from "./Notification";

export default function Navbar() {
  const { user, setAlert, server, setUser, setLoad, setCurrentSolde } =
    useContext(ActContext);
  const [width, setWidth] = useState(document.body.offsetWidth);
  const [notification, setNotification] = useState();
  const navigate = useNavigate();
  const logout = () => {
    setLoad(true);
    setTimeout(() => {
      axios({
        method: "GET",
        url: server + "/logout",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((res) => {
          localStorage.removeItem("token");
          setAlert({ type: "success", message: res.data.message });
          setUser();
          navigate("/");
        })
        .catch((err) => {
          setAlert({
            type: "error",
            message: err.response?.data.error || "Essayer de nouveau!",
          });
        })
        .finally(() => setLoad(false));
    }, 2000);
  };
  const toggleMenu = () => {
    const menu = document.getElementById("menu");
    menu.classList.toggle("show");
  };
  useEffect(() => {
    function changeWidth() {
      setWidth(document.body.offsetWidth);
      document.getElementById("menu")?.classList.remove("show");
    }
    setCurrentSolde(user.solde);
    socket.on("updatesolde",async (data) => {
      if (data.num_compte === user.numCompte) {
        var notifSound = new Audio("/assets/audio/sound.wav");
        setCurrentSolde(data.solde);
        await notifSound.play();
        setNotification(
          <Notification message={data.message} close={setNotification} />
        );
      }
      setTimeout(() => {
        setNotification();
      }, 5000);
    });
    window.addEventListener("resize", changeWidth);
    return () => {
      socket.offAny();
      window.removeEventListener("resize", changeWidth);
    };
    // eslint-disable-next-line
  }, []);
  return (
    <header>
      <img src="/assets/images/logo.png" style={{height:"60px", objectFit: "contain"}} alt="Banque" />
      {width > 630 ? (
        <>
          <div>
            <NavLink to={"/"}>Compte</NavLink>
            {user.type === "admin" && <NavLink to={"/depot"}>Depôt</NavLink>}
            <NavLink to={"retrait"}>Retrait</NavLink>
            <NavLink to={"/transfert"}>Transfert</NavLink>
          </div>
          <Tooltip arrow title={"Déconnexion"}>
            <IconButton sx={iconButton} onClick={logout}>
              <LogoutRounded />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <div>
          <Tooltip arrow title={"Menu"}>
            <IconButton sx={iconButton} onClick={toggleMenu}>
              <MenuRounded />
            </IconButton>
          </Tooltip>
          <div id="menu">
            <div onClick={toggleMenu}>
              <Tooltip arrow title={"Fermer"}>
                <IconButton
                  sx={{
                    alignSelf: "flex-end",
                    marginBottom: "20px",
                    ...iconButton,
                  }}
                >
                  <CloseRounded />
                </IconButton>
              </Tooltip>
              <NavLink to={"/"}>Compte</NavLink>
              {user.type === "admin" && <NavLink to={"/depot"}>Depôt</NavLink>}
              <NavLink to={"retrait"}>Retrait</NavLink>
              <NavLink to={"/transfert"}>Transfert</NavLink>
            </div>
            <Tooltip arrow title={"Déconnexion"}>
              <IconButton sx={iconButton} onClick={logout}>
                <LogoutRounded />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      )}
      {notification}
    </header>
  );
}
