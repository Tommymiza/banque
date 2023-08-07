import { Close } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import React from "react";
import { iconButton } from "./style";

export default function InfoClient({ close, client }) {
  return (
    <Dialog
      open={true}
      onClose={() => close()}
      PaperProps={{
        sx: {
          width: "340px",
        },
      }}
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
            Information:
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
            <h3>N° de compte:</h3>
            <p
              style={{
                borderBottom: "solid 1px var(--shadow)",
                padding: "5px",
              }}
            >
              {client.num_compte}
            </p>
          </div>
          <div>
            <h3>Nom et prénom:</h3>
            <p
              style={{
                borderBottom: "solid 1px var(--shadow)",
                padding: "5px",
              }}
            >
              {client.nom + " " + client.prenom}
            </p>
          </div>
          <div>
            <h3>Adresse:</h3>
            <p
              style={{
                borderBottom: "solid 1px var(--shadow)",
                padding: "5px",
              }}
            >
              {client.adresse}
            </p>
          </div>
          <div>
            <h3>CIN:</h3>
            <p
              style={{
                borderBottom: "solid 1px var(--shadow)",
                padding: "5px",
              }}
            >
              {client.num_cin}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
