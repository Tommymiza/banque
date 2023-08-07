import { Close, PrintRounded } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import React, { useContext, useMemo, useEffect, useState } from "react";
import { iconButton, loadingButton } from "./style";
import { NumberToLetter } from "./Nombrelettre";
import { ActContext } from "../../App";
import { LoadingButton } from "@mui/lab";

export default function Transaction({ close, item }) {
  const [width, setWidth] = useState(document.body.offsetWidth);
  const { formatage } = useContext(ActContext);
  const jour = useMemo(
    () => [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ],
    []
  );
  const mois = useMemo(
    () => [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ],
    []
  );
  const formatDate = (n) => {
    return n < 10 ? "0" + n : n;
  };
  const printScreen = (item) => {
    var mywindow = window.open("", "PRINT");
    mywindow.document.write("<html><head><title>Reçu ou Rélevé</title>");
    mywindow.document.write("<style>*{font-family: 'Segoe UI';}</style></head><body >");
    mywindow.document.write(`
    <div style="display: flex; flex-direction: column; gap: 20px; padding: 50px;">
    <h1 style="font-size: 20px; text-align: center">${item.type}</h1>
    <div>
      <p>
        <b>
          <u>Date:</u>
        </b>
      </p>
      <p>
        ${
          jour[new Date(item.Date).getDay()] +
          ", le " +
          new Date(item.Date).getDate() +
          " " +
          mois[new Date(item.Date).getMonth()] +
          " " +
          new Date(item.Date).getFullYear() +
          " à " +
          formatDate(new Date(item.Date).getHours()) +
          ":" +
          formatDate(new Date(item.Date).getMinutes()) +
          ":" +
          formatDate(new Date(item.Date).getSeconds())
        }
      </p>
    </div>
    <div>
      <p>
        <b>
          <u>Montant:</u>
        </b>
      </p>
      <p>
        ${NumberToLetter(item.Montant)} Ariary (
        ${formatage(item.Montant.toString())} Ar)
      </p>
    </div>
    `);
    if (item.Destinataire) {
      mywindow.document.write(`
        <div>
        <p>
          <b>
            <u>Destinataire:</u>
          </b>
        </p>
        <p>N° compte: ${item.Destinataire}</p>
      </div>
        `);
    }
    mywindow.document.write("</body></html>");
    mywindow.print();
    mywindow.close();
  };
  useEffect(() => {
    function changeWidth() {
      setWidth(document.body.offsetWidth);
      document.getElementById("menu")?.classList.remove("show");
    }
    window.addEventListener("resize", changeWidth);
    return () => {
      window.removeEventListener("resize", changeWidth);
    };
  }, []);
  return (
    <Dialog
      open={true}
      onClose={() => close()}
      PaperProps={{
        sx: {
          width: 800,
        },
      }}
      fullScreen={width < 700 ? true : false}
    >
      <DialogTitle>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "var(--fontText)",
            textAlign: "center",
            position: "relative",
          }}
        >
          <h1
            style={{
              width: "100%",
              marginTop: "5px",
              textTransform: "uppercase",
            }}
          >
            {item.type}
          </h1>
          <Tooltip arrow title={"Fermer"}>
            <IconButton onClick={() => close()} sx={{ ...iconButton }}>
              <Close />
            </IconButton>
          </Tooltip>
        </div>
      </DialogTitle>
      <DialogContent>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <p>
              <b>
                <u>Date:</u>
              </b>
            </p>
            <p>
              {jour[new Date(item.Date).getDay()] +
                ", le " +
                new Date(item.Date).getDate() +
                " " +
                mois[new Date(item.Date).getMonth()] +
                " " +
                new Date(item.Date).getFullYear() +
                " à " +
                formatDate(new Date(item.Date).getHours()) +
                ":" +
                formatDate(new Date(item.Date).getMinutes()) +
                ":" +
                formatDate(new Date(item.Date).getSeconds())}
            </p>
          </div>
          <div>
            <p>
              <b>
                <u>Montant:</u>
              </b>
            </p>
            <p>
              {NumberToLetter(item.Montant)} Ariary (
              {formatage(item.Montant.toString())} Ar)
            </p>
          </div>
          {item.Destinataire && (
            <div>
              <p>
                <b>
                  <u>Destinataire:</u>
                </b>
              </p>
              <p>N° compte: {item.Destinataire}</p>
            </div>
          )}
          <Tooltip arrow title={"Exporter en PDF"}>
          <LoadingButton
            sx={{ ...loadingButton, alignSelf: "center" }}
            onClick={() => printScreen(item)}
          >
            <PrintRounded />
            PDF
          </LoadingButton>
          </Tooltip>
        </div>
      </DialogContent>
    </Dialog>
  );
}
