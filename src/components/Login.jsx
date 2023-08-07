import React, { useState, useContext, useRef, useEffect } from "react";
import { LoadingButton } from "@mui/lab";
import {
  CopyAllRounded,
  LoginRounded,
  RefreshRounded,
  VisibilityOffRounded,
  VisibilityRounded,
} from "@mui/icons-material";
import { loadingButton } from "./Outils/style";
import Loading from "./Outils/Loading";
import axios from "axios";
import { ActContext } from "../App";
import "../styles/login.scss";
import { Tooltip } from "@mui/material";

export default function Login() {
  const { setUser, server, setAlert } = useContext(ActContext);
  const [loadingConnect, setLoadingConnect] = useState(false);
  const [numCompterandom, setNumcompterandom] = useState(
    (Math.random() * 1000000000).toFixed(0)
  );
  const [type, setType] = useState("password");
  const [page, setPage] = useState("connexion");
  const form = useRef(null);
  const loginForm = (e) => {
    e.preventDefault();
    if (
      form.current.numCompte.value === "" ||
      form.current.password.value === ""
    ) {
      setAlert({ type: "warning", message: "Veuillez remplir les champs!" });
      if (form.current.numCompte.value === "") {
        form.current.numCompte.focus();
      } else {
        form.current.password.focus();
      }
      return;
    }
    setLoadingConnect(true);
    setTimeout(() => {
      axios({
        method: "POST",
        url: server + "/login",
        data: {
          numCompte: form.current.numCompte.value,
          password: form.current.password.value,
        },
      })
        .then((res) => {
          setUser(res.data.user);
          localStorage.setItem("token", res.data.token);
          setAlert({ type: "success", message: res.data.message });
        })
        .catch((err) => {
          setAlert({
            type: "error",
            message: err.response?.data.error || "Erreur de connexion!",
          });
        })
        .finally(() => setLoadingConnect(false));
    }, 2000);
  };
  const signForm = (e) => {
    e.preventDefault();
    if (
      form.current.numCIN.value === "" ||
      form.current.password.value === "" ||
      form.current.nom.value === "" ||
      form.current.prenom.value === ""
    ) {
      setAlert({ type: "warning", message: "Veuillez remplir les champs!" });
      if (form.current.numCIN.value === "") {
        form.current.numCIN.focus();
        return;
      }
      if (form.current.password.value === "") {
        form.current.password.focus();
        return;
      }
      if (form.current.nom.value === "") {
        form.current.nom.focus();
        return;
      }
      if (form.current.prenom.value === "") {
        form.current.prenom.focus();
        return;
      }
    }
    if (form.current.numCIN.value.length !== 12) {
      setAlert({ type: "warning", message: "N° CIN invalide!" });
      return;
    }
    if (!form.current.accept.checked) {
      setAlert({
        type: "warning",
        message: "Veuillez accepter les conditions!",
      });
      return;
    }
    setLoadingConnect(true);
    setTimeout(() => {
      axios({
        method: "POST",
        url: server + "/signup",
        data: {
          numCompte: form.current.numCompte.value,
          numCIN: form.current.numCIN.value,
          password: form.current.password.value,
          nom: form.current.nom.value,
          prenom: form.current.prenom.value,
          adresse: form.current.adresse.value,
        },
      })
        .then((res) => {
          setAlert({ type: "success", message: res.data.message });
          togglePage();
        })
        .catch((err) => {
          setAlert({
            type: "error",
            message: err.response?.data.error || "Erreur de connexion!",
          });
        })
        .finally(() => setLoadingConnect(false));
    }, 2000);
  };
  const toggleType = () => {
    setType(type === "password" ? "text" : "password");
  };
  const togglePage = () => {
    setPage(page === "connexion" ? "inscription" : "connexion");
  };
  const copyNum = () => {
    navigator.clipboard.writeText(numCompterandom.toString());
    setAlert({ type: "success", message: "Copié dans le presse-papier" });
  };
  useEffect(() => {
    setNumcompterandom((Math.random() * 1000000000).toFixed(0));
  }, [page]);
  return page === "connexion" ? (
    <div id="login">
      <form onSubmit={loginForm} ref={form}>
        <h1>Connexion</h1>
        <div className="text-input">
          <label htmlFor="numCompte">N° de compte ou N° CIN:</label>
          <input
            id="numCompte"
            type="number"
            name="numCompte"
            placeholder="ex: 600000255"
          />
        </div>
        <div className="text-input">
          <label htmlFor="password">Mot de passe:</label>
          <input
            id="password"
            type={type}
            name="password"
            style={{ paddingRight: "40px" }}
          />
          <i className="password-icon" onClick={toggleType}>
            {type === "text" ? (
              <Tooltip arrow title={"Cacher le mot de passe"}>
                <VisibilityOffRounded />
              </Tooltip>
            ) : (
              <Tooltip arrow title={"Afficher le mot de passe"}>
                <VisibilityRounded />
              </Tooltip>
            )}
          </i>
        </div>
        <LoadingButton
          type="submit"
          sx={loadingButton}
          loading={loadingConnect}
          loadingIndicator={<Loading size={50} speed={1} />}
        >
          <LoginRounded />
          <p>Connexion</p>
        </LoadingButton>
        <p className="text-button" onClick={togglePage}>
          Créer un compte
        </p>
      </form>
    </div>
  ) : (
    <div id="signup">
      <form onSubmit={signForm} ref={form}>
        <h1>Inscription</h1>
        <div>
          <div className="text-input">
            <label htmlFor="numCompte">N° de compte:</label>
            <input
              id="numCompte"
              type="number"
              name="numCompte"
              disabled
              value={numCompterandom}
            />
            <Tooltip arrow title={"Regénerer un nouveau"}>
              <i
                className="password-icon"
                style={{ right: "40px" }}
                onClick={() =>
                  setNumcompterandom((Math.random() * 1000000000).toFixed(0))
                }
              >
                <RefreshRounded />
              </i>
            </Tooltip>
            <Tooltip
              arrow
              title={"Copier dans presse-papier"}
              onClick={copyNum}
            >
              <i className="password-icon">
                <CopyAllRounded />
              </i>
            </Tooltip>
          </div>
          <div className="text-input">
            <label htmlFor="numCIN">
              N° CIN: <span>*</span>
            </label>
            <input id="numCIN" type="number" name="numCIN" />
          </div>
          <div className="text-input">
            <label htmlFor="password">
              Mot de passe: <span>*</span>
            </label>
            <input
              id="password"
              type={type}
              name="password"
              style={{ paddingRight: "40px" }}
            />
            <i className="password-icon" onClick={toggleType}>
              {type === "text" ? (
                <Tooltip arrow title={"Cacher le mot de passe"}>
                  <VisibilityOffRounded />
                </Tooltip>
              ) : (
                <Tooltip arrow title={"Afficher le mot de passe"}>
                  <VisibilityRounded />
                </Tooltip>
              )}
            </i>
          </div>
        </div>
        <div>
          <div className="text-input">
            <label htmlFor="nom">
              Nom: <span>*</span>
            </label>
            <input id="nom" type="text" name="nom" />
          </div>
          <div className="text-input">
            <label htmlFor="prenom">
              Prénom(s): <span>*</span>
            </label>
            <input id="prenom" type="text" name="prenom" />
          </div>
          <div className="text-input">
            <label htmlFor="adresse">Adresse:</label>
            <input id="adresse" type="text" name="adresse" />
          </div>
        </div>
        <p>
          Les champs avec (
          <span style={{ color: "var(--error)", fontWeight: "bolder" }}>*</span>
          ) sont obligatoires
        </p>
        <div>
          <input
            type="checkbox"
            name="accept"
            id="accept"
            className="custom-checkbox"
          />
          <label htmlFor="accept">J'accepte les conditions d'utilisation</label>
        </div>
        <LoadingButton
          type="submit"
          sx={loadingButton}
          loading={loadingConnect}
          loadingIndicator={<Loading size={50} speed={1} />}
        >
          <LoginRounded />
          <p>Inscription</p>
        </LoadingButton>
        <p className="text-button" onClick={togglePage}>
          Se connecter
        </p>
      </form>
    </div>
  );
}
