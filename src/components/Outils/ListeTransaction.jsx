import { Close, PrintRounded } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { iconButton, loadingButton } from "./style";
import { ActContext } from "../../App";
import { LoadingButton } from "@mui/lab";
import axios from "axios";
import Loading from "./Loading";

export default function ListeTransaction({ item, close }) {
  const [width, setWidth] = useState(document.body.offsetWidth);
  const [isLoading, setIsLoading] = useState(true);
  const [trans, setTrans] = useState([]);
  const { formatage, setAlert, server } = useContext(ActContext);
  const printScreen = () => {
    var mywindow = window.open("", "PRINT");
    mywindow.document.write("<html><head><title>Reçu ou Rélevé</title>");
    mywindow.document.write(
      "<style>*{font-family: 'Segoe UI';}</style></head><body >"
    );
    mywindow.document.write(`
        <div style="display: flex;flex-direction: row; justify-content: space-between; align-items: center">
            <h1>Relevé des transactions:</h1>
            <div style="display: flex; flex-direction: column; gap: 0px">
                <p style="margin: 0">N° de compte: ${item.num_compte}</p>
                <p style="margin: 0">${item.nom + " " + item.prenom}</p>
                <p style="margin: 0">Date: ${new Date().toLocaleString("fr")}</p>
            </div>
        </div>
    `)
    mywindow.document.write(document.getElementById("list-transaction").innerHTML);
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
    setIsLoading(true);
    setTimeout(() => {
      axios({
        method: "POST",
        url: server + "/transactions",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        data: {
          numCompte: item.num_compte,
        },
      })
        .then((res) => {
          setTrans(res.data.list);
        })
        .catch((err) => {
          setAlert({
            type: "error",
            message: err.response?.data.error || "Erreur de connexion!",
          });
        })
        .finally(() => setIsLoading(false));
    }, 1000);
    return () => {
      window.removeEventListener("resize", changeWidth);
    };
    // eslint-disable-next-line
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
            Transactions
          </h1>
          <Tooltip arrow title={"Fermer"}>
            <IconButton onClick={() => close()} sx={{ ...iconButton }}>
              <Close />
            </IconButton>
          </Tooltip>
        </div>
      </DialogTitle>
      <DialogContent>
        {!isLoading ? (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {trans.length === 0 ? (
              <p>
                <i>
                  Il n'existe pas de transaction de ce compte pour le moment
                </i>
              </p>
            ) : (
              <>
                <div id="list-transaction" style={{display: "flex", flexDirection: "column", gap: "5px"}}>
                  {trans.map((t, index) => (
                    <div key={index} className="trans" style={{padding: "10px", borderBottom: "solid 1px rgba(0,0,0,0.2)"}}>
                      <p>
                        {t.type} de <i>{formatage(t.Montant.toString())} Ar</i>{" "}
                        {t.Destinataire
                          ? `vers le N° de compte: ${t.Destinataire}`
                          : ""}{" "}
                        le {new Date(t.Date).toLocaleString("fr")}
                      </p>
                    </div>
                  ))}
                </div>
                <Tooltip arrow title={"Exporter en PDF"}>
                  <LoadingButton
                    sx={{ ...loadingButton, alignSelf: "center" }}
                    onClick={printScreen}
                  >
                    <PrintRounded />
                    PDF
                  </LoadingButton>
                </Tooltip>
              </>
            )}
          </div>
        ) : (
          <div style={{ position: "relative", height: "150px" }}>
            <Loading size={100} speed={1} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
