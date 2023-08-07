import React, { useContext, useState, useRef } from "react";
import { ActContext } from "../App";
import { Tooltip } from "@mui/material";
import { HelpOutline, PaidRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { loadingButton } from "./Outils/style";
import axios from "axios";
import Loading from "./Outils/Loading";

export default function Transfert() {
  const { user, setAlert, server, currentSolde, setCurrentSolde, formatage } = useContext(ActContext);
  const [loading, setLoading] = useState(false);
  const [compte, setCompte] = useState("");
  const [montant, setMontant] = useState("");
  const form = useRef(null);
  const valider = (e) => {
    e.preventDefault();
    if (form.current.numCompte.value === "" || form.current.solde.value === "") {
      setAlert({ type: "warning", message: "Veuillez remplir les champs!" });
      if (form.current.numCompte.value === "") {
        form.current.numCompte.focus();
      } else {
        form.current.solde.focus();
      }
      return;
    }
    if(form.current.numCompte.value === user.numCompte.toString()){
      setAlert({type: "warning", message: "Vous ne pouvez pas faire de transfert à vous même!"});
      return;
    }
    setLoading(true);
    setTimeout(() => {
      axios({
        url: server + "/addtransfert",
        method: "POST",
        data: {
          numDest: form.current.numCompte.value,
          solde: form.current.solde.value,
        },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((res) => {
          setAlert({ type: "success", message: res.data.message });
          user.solde = res.data.solde
          setCurrentSolde(res.data.solde)
          form.current.solde.value = "";
          form.current.numCompte.value = "";
          setCompte("");
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
          <h1>Efféctué un transfert:</h1>
          <div>
            <label htmlFor="numCompte">
              N° du compte:<span>*</span>&nbsp;
              <Tooltip arrow title={"Compte du destinataire"}>
                <HelpOutline />
              </Tooltip>
            </label>
            <input
              type="number"
              name="numCompte"
              id="numCompte"
              onChange={(e)=>setCompte(e.currentTarget.value)}
            />
          </div>
          <div>
            <label htmlFor="solde">
              Solde à tranférer:<span>*</span>&nbsp;
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
            disabled={montant < 5000 || montant > currentSolde || compte === "" ? true : false}
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
