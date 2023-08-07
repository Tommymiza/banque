import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ActContext } from "../App";
import { Tooltip } from "@mui/material";
import { HelpOutline, PaidRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { loadingButton } from "./Outils/style";
import axios from "axios";
import Loading from "./Outils/Loading";

export default function Depot() {
  const { user, setAlert, server } = useContext(ActContext);
  const [loading, setLoading] = useState(false);
  const [compte, setCompte] = useState("");
  const [montant, setMontant] = useState("");
  const [unite, setUnite] = useState("MGA");
  const form = useRef(null);
  const navigate = useNavigate();
  const currency = {
    USD: 4423,
    EUR: 4756,
    MGF: 0.2,
    JPY: 31,
    MGA: 1,
  };
  const conversion = (units, n) => {
    return n * currency[units];
  };
  const minimum = {
    USD: "12 USD",
    EUR: "11 EUR",
    MGF: "250 000 FMG",
    JPY: "1 576 YEN",
    MGA: "50 000 AR",
  };
  const valider = (e) => {
    e.preventDefault();
    const f = form.current;
    if (f.numCompte.value === "" || f.solde.value === "") {
      setAlert({ type: "warning", message: "Veuillez remplir les champs!" });
      if (f.numCompte.value === "") {
        f.numCompte.focus();
      } else {
        f.solde.focus();
      }
      return;
    }
    if(f.numCompte.value === user.numCompte.toString()){
      setAlert({type: "warning", message: "Vous ne pouvez pas faire de transfert à vous même!"});
      return;
    }
    const solde = conversion(f.unit.value, f.solde.value);
    if (solde < 50000) {
      setAlert({
        type: "warning",
        message: `Solde minimum à ${minimum[f.unit.value]}`,
      });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      axios({
        url: server + "/adddepot",
        method: "POST",
        data: {
          num_compte: compte,
          solde: solde,
        },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((res) => {
          setAlert({ type: "success", message: res.data.message });
          f.numCompte.value = "";
          f.solde.value = "";
          setCompte("");
          setMontant("");
        })
        .catch((err) => {
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
  useEffect(() => {
    if (user.type !== "admin") {
      navigate("/");
    }
    // eslint-disable-next-line
  }, []);
  return (
    <div className="container">
      <form className="center-form" ref={form} onSubmit={valider}>
        <div>
          <h1>Efféctué un versement:</h1>
          <div>
            <label htmlFor="numCompte">
              N° du compte:<span>*</span>&nbsp;
              <Tooltip arrow title={"Celui du destinataire"}>
                <HelpOutline />
              </Tooltip>
            </label>
            <input
              placeholder="ex: 600000255"
              type="number"
              name="numCompte"
              id="numCompte"
              onChange={(e) => setCompte(e.currentTarget.value)}
            />
          </div>
          <div>
            <label htmlFor="solde">
              Solde à verser:<span>*</span>&nbsp;
              <Tooltip arrow title={`Minimum ${minimum[unite]}`}>
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
              onChange={(e) => setUnite(e.currentTarget.value)}
              style={{
                position: "absolute",
                right: 0,
                height: "50px",
                borderRadius: "0 7px 7px 0",
              }}
            >
              <option value="MGA">MGA</option>
              <option value="MGF">FMG</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="JPY">YEN</option>
            </select>
          </div>
          <LoadingButton
            disabled={
              compte === "" || montant * currency[unite] < 50000 ? true : false
            }
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
