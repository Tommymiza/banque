import React, { useState, useEffect, createContext } from "react";
import Login from "./components/Login";
import Loading from "./components/Outils/Loading";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AlertCustom from "./components/Outils/AlertCustom";
import Accueil from "./components/Accueil";
import axios from "axios";
import Navbar from "./components/Outils/Navbar";
import Depot from "./components/Depot";
import Retrait from "./components/Retrait";
import Transfert from "./components/Transfert";
import { ThemeProvider } from "@mui/material";
import { theme } from "./components/Outils/theme";

export const ActContext = createContext();
function App() {
  const [user, setUser] = useState();
  const [load, setLoad] = useState(true);
  const [alert, setAlert] = useState(null);
  const [currentSolde, setCurrentSolde] = useState("");
  const server = "http://127.0.0.1:4422";
  const formatage = (str) => {
    var res = "";
    var j = 1;
    for (let i = str.length; i > 0; i--) {
      if (j % 3 === 0) {
        res += str[i - 1] + " ";
      } else {
        res += str[i - 1];
      }
      j++;
    }
    var resultat = "";
    for (let i = res.length; i > 0; i--) {
      resultat += res[i - 1];
    }
    return resultat;
  };
  useEffect(() => {
    if (alert) {
      setTimeout(() => {
        setAlert(null);
      }, 2000);
    }
  }, [alert]);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      axios({
        method: "GET",
        url: server + "/check",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((res) => {
          setUser(res.data.user);
          setAlert({ type: "success", message: res.data.message });
        })
        .catch((err) => {
          localStorage.removeItem("token");
          setAlert({ type: "error", message: err.response.data.error });
        })
        .finally(() => setLoad(false));
    } else {
      setLoad(false);
    }
  }, []);

  return (
    <ActContext.Provider
      value={{
        user,
        setUser,
        server,
        setAlert,
        setLoad,
        currentSolde,
        setCurrentSolde,
        formatage
      }}
    >
      {alert && <AlertCustom alert={alert} />}
      {load ? (
        <Loading size={150} speed={0.75} />
      ) : user ? (
        <BrowserRouter>
          <Navbar />
          <ThemeProvider theme={theme}>
            <Routes>
              <Route path="/" element={<Accueil />}></Route>
              <Route path="/depot" element={<Depot />}></Route>
              <Route path="/retrait" element={<Retrait />}></Route>
              <Route path="/transfert" element={<Transfert />}></Route>
            </Routes>
          </ThemeProvider>
        </BrowserRouter>
      ) : (
        <Login />
      )}
    </ActContext.Provider>
  );
}
export default App;
