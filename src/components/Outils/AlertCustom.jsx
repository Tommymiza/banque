import React from "react";
import {
  CheckRounded,
  ErrorRounded,
  InfoRounded,
  WarningRounded,
} from "@mui/icons-material";
import { motion } from "framer-motion";

export default function AlertCustom({ alert, rand }) {
  const color = {
    info: "var(--info)",
    success: "var(--success)",
    warning: "var(--warning)",
    error: "var(--error)",
  };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: -100, translateX: "-50%" }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.3 },
      }}
      id="alert"
      style={{ background: color[alert.type] }}
    >
      {alert.type === "info" && <InfoRounded />}
      {alert.type === "success" && <CheckRounded />}
      {alert.type === "warning" && <WarningRounded />}
      {alert.type === "error" && <ErrorRounded />}
      <p>{alert.message}</p>
    </motion.div>
  );
}
