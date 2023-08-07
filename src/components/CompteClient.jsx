import React, { useContext, useRef, useState, useMemo, useEffect } from "react";
import { ActContext } from "../App";
import {
  MRT_FullScreenToggleButton,
  MRT_GlobalFilterTextField,
  MaterialReactTable,
} from "material-react-table";
import { MRT_Localization_FR } from "material-react-table/locales/fr";
import axios from "axios";
import Loading from "./Outils/Loading";
import { Box, Drawer, IconButton, TextField, Tooltip } from "@mui/material";
import {
  ArrowBack,
  CopyAllRounded,
  DeleteRounded,
  EditRounded,
  ManageAccountsRounded,
  RefreshRounded,
  VisibilityRounded,
} from "@mui/icons-material";
import { iconButton, loadingButton } from "./Outils/style";
import LottieLoading from "./Outils/LottieLoading";
import { LoadingButton } from "@mui/lab";
import Transaction from "./Outils/Transaction";

export default function CompteClient() {
  const { user, setAlert, server, currentSolde, formatage, setUser } =
    useContext(ActContext);
  const form = useRef(null);
  const [loadDelete, setLoadDelete] = useState(false);
  const [loadUpdate, setLoadUpdate] = useState(false);
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState(document.body.offsetWidth);
  const [info, setInfo] = useState(null);
  const [nom, setNom] = useState(user.nom);
  const [isLoading, setIsLoading] = useState(true);
  const [prenom, setPrenom] = useState(user.prenom);
  const [adresse, setAdresse] = useState(user.adresse);
  const [trans, setTrans] = useState([]);
  const [selected, setSelected] = useState({});
  const [compteSelected, setCompteSelected] = useState([]);
  const tableInstance = useRef(null);

  const columns = useMemo(
    () => [
      {
        accessorKey: "type",
        header: "Type",
        size: 50,
      },
      {
        accessorKey: "Date",
        header: "Date",
        Cell: ({ cell }) => (
          <p>
            {new Date(cell.getValue()).toLocaleString("fr").split(" ")[0]}&nbsp;
            {new Date(cell.getValue()).toLocaleString("fr").split(" ")[1]}
          </p>
        ),
        minSize: 50,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorFn: (row) => `${formatage(row.Montant.toString())} Ar`,
        header: "Montant",
        muiTableHeadCellProps: {
          align: "center",
        },
        sortingFn: (rowA, rowB, columnsId) => {
          return rowA.original[columnsId] - rowB.original[columnsId];
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
    ],
    [formatage]
  );

  const deleteMany = () => {
    const list = compteSelected.map((item) => {
      return {
        id: tableInstance.current.getRow(item).original.id,
        type: tableInstance.current.getRow(item).original.type,
      };
    });
    setLoadDelete(true);
    setTimeout(() => {
      axios({
        method: "DELETE",
        url: server + "/deletetransaction",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        data: {
          list,
        },
      })
        .then((res) => {
          console.log(res);
          setTrans(res.data.list);
          setAlert({ type: "success", message: "Suppression réussi!" });
        })
        .catch((err) => {
          console.log(err);
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
          message: err.response?.data.error || "Erreur de connexion!",
        });
      })
      .finally(() => setLoadUpdate(false));
  };

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      axios({
        method: "POST",
        url: server + "/transactions",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        data: {
          numCompte: user.numCompte,
          test: "test",
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
        muiTablePaperProps={{
          sx: {
            width: "100%",
          },
        }}
        selectAllMode="page"
        columns={columns}
        data={trans}
        localization={MRT_Localization_FR}
        enableColumnActions={false}
        enableRowSelection={true}
        enableGlobalFilter={true}
        initialState={{
          showGlobalFilter: true,
          pagination: { pageSize: 5 },
          sorting: [{ id: "Date", desc: true }],
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
        muiLinearProgressProps={({ isTopToolbar }) => ({
          sx: {
            display: "none",
          },
        })}
        muiBottomToolbarProps={{
          sx: {
            "&>div>div": {
              justifyContent: "center",
              left: "50%",
              transform: "translateX(-50%)",
              width: "100%",
            },
          },
        }}
        defaultColumn={{
          minSize: 80,
        }}
        enableRowActions
        positionActionsColumn="last"
        renderRowActions={({ row, table }) => (
          <Box
            sx={{
              display: "flex",
              flexWrap: "nowrap",
            }}
          >
            <Tooltip arrow title={"Afficher"}>
              <IconButton
                sx={iconButton}
                onClick={() => {
                  setInfo(<Transaction item={row.original} close={setInfo} />);
                }}
              >
                <VisibilityRounded />
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
            <h1>Liste des Transactions:</h1>
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
}
