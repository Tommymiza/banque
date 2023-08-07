import React, { useContext, useState, useRef } from "react";
import { ActContext } from "../App";
import { Tooltip } from "@mui/material";
import { HelpOutline, PaidRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { loadingButton } from "./Outils/style";
import axios from "axios";
import Loading from "./Outils/Loading";

export default function Retrait() {
  const { user, setAlert, server, currentSolde, setCurrentSolde, formatage } =
    useContext(ActContext);
  const [loading, setLoading] = useState(false);
  const [montant, setMontant] = useState("");
  const form = useRef(null);
  const valider = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      axios({
        url: server + "/addretrait",
        method: "POST",
        data: {
          solde: form.current.solde.value,
        },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((res) => {
          setAlert({ type: "success", message: res.data.message });
          user.solde = res.data.solde;
          setCurrentSolde(res.data.solde);
          form.current.solde.value = "";
          setMontant("");
        })
        .catch((err) => {
          console.log(err);
          setAlert({
            type: "error",
            message: err.response.data.error || "Erreur de connexion!",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }, 2000);
  };
  return (
    <div className="container">
      <form className="center-form" ref={form} onSubmit={valider}>
        <div>
          <h1>Efféctué un retrait:</h1>
          <div>
            <label htmlFor="numCompte">
              N° du compte:
              <Tooltip arrow title={"Votre compte"}>
                <HelpOutline />
              </Tooltip>
            </label>
            <input
              type="number"
              name="numCompte"
              id="numCompte"
              disabled
              defaultValue={user.numCompte}
            />
          </div>
          <div>
            <label htmlFor="solde">
              Solde à retirer:<span>*</span>&nbsp;
              <Tooltip
                arrow
                title={
                  currentSolde >= 5000
                    ? `5 000 Ar - ${formatage(currentSolde.toString())} Ar`
                    : "Votre solde est insuffisant!"
                }
              >
                <HelpOutline />
              </Tooltip>
            </label>
            <input
              type="number"
              name="solde"
              id="solde"
              onChange={(e) => setMontant(e.currentTarget.value)}
            />
            <select
              name="unit"
              id="unit"
              disabled
              style={{
                position: "absolute",
                right: 0,
                height: "50px",
                borderRadius: "0 7px 7px 0",
              }}
            >
              <option value="MGA">MGA</option>
            </select>
          </div>
          <LoadingButton
            disabled={montant < 5000 || montant > currentSolde ? true : false}
            type="submit"
            sx={loadingButton}
            loading={loading}
            loadingIndicator={<Loading size={50} speed={1} />}
          >
            <PaidRounded />
            <p>Valider</p>
          </LoadingButton>
        </div>
      </form>
    </div>
  );
}
