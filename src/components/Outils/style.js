export const loadingButton = {
  background: "var(--primary)",
  border: "2px solid var(--primary)",
  color: "white",
  textTransform: "none",
  borderRadius: "7px",
  transition: ".4s",
  width: "fit-content",
  "&:hover": {
    background: "var(--primary)",
    boxShadow: "0 0 10px var(--shadow)",
  },
  display: "flex",
  flexDirection: "row",
  gap: "7px",
  fontFamily: "Averta",
  fontWeight: "bolder",
  "&:disabled": {
    background: "none",
    border: "2px solid var(--primary)",
    cursor: "not-allowed",
  },
};

export const iconButton = {
  background: "rgba(0, 0, 0, 0.04)",
  transition: ".4s",
  boxShadow: "0 0 5px var(--shadow)",
  color: "var(--primary)",
  "&:hover": { boxShadow: "0 0 10px var(--shadow)" },
};
