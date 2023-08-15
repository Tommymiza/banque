import React, { useState, useMemo, useContext, useEffect, useRef } from "react";
import { ActContext } from "../App";
import {
  MRT_FullScreenToggleButton,
  MRT_GlobalFilterTextField,
  MaterialReactTable,
} from "material-react-table";
import { MRT_Localization_FR } from "material-react-table/locales/fr";
import axios from "axios";
import Loading from "./Outils/Loading";
import { Box, IconButton, Tooltip, Drawer, TextField } from "@mui/material";
import {
  CopyAllRounded,
  DeleteRounded,
  ReceiptLongRounded,
  VisibilityRounded,
  ArrowBack,
  EditRounded,
  RefreshRounded,
  ManageAccountsRounded,
} from "@mui/icons-material";
import { iconButton, loadingButton } from "./Outils/style";
import { LoadingButton } from "@mui/lab";
import LottieLoading from "./Outils/LottieLoading";
import InfoClient from "./Outils/InfoClient";
import ListeTransaction from "./Outils/ListeTransaction";

const CompteAdmin = () => {
  const { server, setAlert, user, currentSolde, formatage, setUser } =
    useContext(ActContext);
  const [loadDelete, setLoadDelete] = useState(false);
  const [loadUpdate, setLoadUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [nom, setNom] = useState(user.nom);
  const [prenom, setPrenom] = useState(user.prenom);
  const [adresse, setAdresse] = useState(user.adresse);
  const [width, setWidth] = useState(document.body.offsetWidth);
  const [info, setInfo] = useState(null);
  const [clients, setClients] = useState([]);
  const [selected, setSelected] = useState({});
  const [compteSelected, setCompteSelected] = useState([]);
  const tableInstance = useRef(null);
  const form = useRef(null);

  const columns = useMemo(
    () => [
      {
        accessorKey: "num_compte",
        header: "N° de Compte",
        enableClickToCopy: true,
        muiTableBodyCellCopyButtonProps: {
          fullWidth: true,
          endIcon: <CopyAllRounded />,
          sx: { justifyContent: "flex-start", width: "fit-content" },
        },
      },
      {
        accessorKey: "nom",
        header: "Nom",
      },
      {
        accessorKey: "prenom",
        header: "Prénom",
      },
    ],
    []
  );
  const deleteMany = () => {
    const list = compteSelected.map(
      (item) => tableInstance.current.getRow(item).original.num_compte
    );
    setLoadDelete(true);
    setTimeout(() => {
      axios({
        method: "DELETE",
        url: server + "/deleteaccount",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        data: {
          list,
        },
      })
        .then((res) => {
          setClients(res.data.liste);
          setAlert({ type: "success", message: "Suppression réussi!" });
        })
        .catch((err) => {
          setAlert({
            type: "error",
            message: err.response?.data.error || "Erreur de connexion!",
          });
        })
        .finally(() => {
          setSelected({});
          setLoadDelete(false);
        });
    }, 2000);
  };
  const updateInfo = (e) => {
    e.preventDefault();
    setLoadUpdate(true);
    axios({
      url: server + "/updateinfo",
      method: "PUT",
      data: {
        nom,
        prenom,
        adresse,
      },
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => {
        setUser(res.data.user);
        setAlert({ type: "success", message: res.data.message });
      })
      .catch((err) => {
        setAlert({
          type: "error",
          message: err.response.data.error || "Erreur de connexion!",
        });
      })
      .finally(() => setLoadUpdate(false));
  };
  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      axios({
        method: "GET",
        url: server + "/findall",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((res) => {
          setClients(res.data.list);
        })
        .catch((err) => {
          setAlert({
            type: "error",
            message: err.response?.data.error || "Erreur de connexion!",
          });
        })
        .finally(() => setIsLoading(false));
    }, 2000);
  };
  useEffect(() => {
    const idRows = Object.keys(selected);
    setCompteSelected(idRows);
  }, [selected]);
  useEffect(() => {
    function changeWidth() {
      setWidth(document.body.offsetWidth);
      document.getElementById("menu")?.classList.remove("show");
    }
    window.addEventListener("resize", changeWidth);
    refreshData();
    return () => {
      window.removeEventListener("resize", changeWidth);
    };
    // eslint-disable-next-line
  }, []);
  return (
    <div className="container">
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ zIndex: 5000 }}
      >
        <form
          ref={form}
          onSubmit={updateInfo}
          id="info-form"
          style={{ boxShadow: "none" }}
        >
          <Tooltip
            arrow
            title={"Fermer"}
            PopperProps={{
              sx: { zIndex: 5001 },
            }}
          >
            <IconButton sx={iconButton} onClick={() => setOpen(false)}>
              <ArrowBack />
            </IconButton>
          </Tooltip>
          <h1 style={{ alignSelf: "center" }}>Information:</h1>
          <div>
            <h3>N° du compte:</h3>
            <Tooltip arrow title={"Copier dans le presse-papier"}>
              <p
                className="copy-text"
                onClick={() => {
                  navigator.clipboard.writeText(user.numCompte);
                  setAlert({
                    type: "success",
                    message: "Copié dans le presse-papier",
                  });
                }}
              >
                {user.numCompte} <CopyAllRounded sx={{ fontSize: "25px" }} />
              </p>
            </Tooltip>
          </div>
          <div>
            <h3>Solde actuel:</h3>
            <p>{formatage(currentSolde.toString())} Ar</p>
          </div>
          <div>
            <h3>CIN:</h3>
            <p>{user.numCIN}</p>
          </div>
          <div>
            <h3>Nom:</h3>
            <TextField
              variant="standard"
              defaultValue={nom}
              name="nom"
              inputProps={{
                style: { paddingLeft: "5px" },
                className: "input-none",
              }}
              onChange={(e) => {
                setNom(e.currentTarget.value);
              }}
            />
          </div>
          <div>
            <h3>Prénom(s):</h3>
            <TextField
              variant="standard"
              defaultValue={prenom}
              name="prenom"
              inputProps={{
                style: { paddingLeft: "5px" },
                className: "input-none",
              }}
              onChange={(e) => {
                setPrenom(e.currentTarget.value);
              }}
            />
          </div>
          <div>
            <h3>Adresse:</h3>
            <TextField
              variant="standard"
              defaultValue={adresse}
              name="adresse"
              inputProps={{
                style: { paddingLeft: "5px" },
                className: "input-none",
              }}
              onChange={(e) => {
                setAdresse(e.currentTarget.value);
              }}
            />
          </div>
          <LoadingButton
            sx={{ ...loadingButton, alignSelf: "center" }}
            disabled={
              (nom === user.nom &&
                prenom === user.prenom &&
                adresse === user.adresse) ||
              nom === "" ||
              prenom === "" ||
              adresse === ""
                ? true
                : false
            }
            type="submit"
            loading={loadUpdate}
            loadingIndicator={<Loading size={50} speed={1} />}
          >
            <EditRounded />
            <p>Sauvegarder</p>
          </LoadingButton>
        </form>
      </Drawer>
      <MaterialReactTable
        tableInstanceRef={tableInstance}
        selectAllMode="page"
        columns={columns}
        data={clients}
        localization={MRT_Localization_FR}
        enableColumnActions={false}
        enableRowSelection={true}
        enableGlobalFilter={true}
        initialState={{
          showGlobalFilter: true,
          pagination: { pageSize: 5 },
          sorting: [{ id: "nom", asc: true }],
        }}
        muiToolbarAlertBannerProps={{
          sx: { display: "none" },
        }}
        onRowSelectionChange={setSelected}
        muiTableHeadCellProps={{
          sx: { color: "var(--primary)" },
        }}
        state={{
          rowSelection: selected,
          isLoading,
        }}
        muiBottomToolbarProps={{
          sx: {
            "&>div>div": {
              justifyContent: "center",
              left: "50%",
              transform: "translateX(-50%)",
            },
          },
        }}
        muiLinearProgressProps={({ isTopToolbar }) => ({
          sx: {
            display: "none",
          },
        })}
        enableRowActions
        positionActionsColumn="last"
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "20px" }}>
            <Tooltip arrow title={"Afficher"}>
              <IconButton
                sx={iconButton}
                onClick={() => {
                  setInfo(<InfoClient client={row.original} close={setInfo} />);
                }}
              >
                <VisibilityRounded />
              </IconButton>
            </Tooltip>
            <Tooltip arrow title={"Liste transactions"}>
              <IconButton
                sx={{ ...iconButton, color: "var(--warning)" }}
                onClick={() => {setInfo(<ListeTransaction item={row.original} close={setInfo} />)}}
              >
                <ReceiptLongRounded />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbar={({ table }) => (
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              justifyContent: width > 850 ? "space-between" : "space-around",
              padding: "20px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <h1>Liste des comptes:</h1>
            {/* eslint-disable-next-line */}
            <Box
              sx={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                justifyContent: "space-around",
              }}
            >
              <Box sx={{ marginTop: "5px", minWidth: 240 }}>
                {/* eslint-disable-next-line */}
                <MRT_GlobalFilterTextField table={table} />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-end",
                }}
              >
                <Tooltip arrow title={"Actualiser les données"}>
                  <IconButton sx={iconButton} onClick={refreshData}>
                    <RefreshRounded />
                  </IconButton>
                </Tooltip>
                <Tooltip arrow title={"Supprimer les comptes seléctionnés"}>
                  <span>
                    <IconButton
                      sx={{
                        ...iconButton,
                      }}
                      disabled={
                        compteSelected.length === 0 || loadDelete ? true : false
                      }
                      onClick={deleteMany}
                    >
                      {loadDelete ? (
                        <LottieLoading size={26} speed={0.5} />
                      ) : (
                        <DeleteRounded />
                      )}
                    </IconButton>
                  </span>
                </Tooltip>
                {/* eslint-disable-next-line */}
                <MRT_FullScreenToggleButton table={table} sx={iconButton} />
                <Tooltip arrow title={"Information de votre compte"}>
                  <IconButton
                    sx={{
                      ...iconButton,
                    }}
                    onClick={() => setOpen(!open)}
                  >
                    <ManageAccountsRounded />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        )}
        muiTableBodyCellProps={{
          sx: { fontSize: "var(--fontSize)" },
        }}
        muiSearchTextFieldProps={{
          inputProps: {
            className: "input-none",
          },
        }}
      />
      {info}
    </div>
  );
};

export default CompteAdmin;
