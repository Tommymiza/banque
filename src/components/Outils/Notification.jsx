import { CloseOutlined, NotificationsActiveRounded } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import React from "react";
import { motion } from "framer-motion";

export default function Notification({ message, close }) {
  return (
    <motion.div
      initial={{ x: 360 }}
      animate={{ x: 0, transition: { duration: 0.7 } }}
      className="notification"
    >
      <div>
        <div>
          <NotificationsActiveRounded />
          <h3>Notification important:</h3>
        </div>
        <Tooltip arrow title={"Fermer"}>
          <CloseOutlined onClick={() => close()} sx={{ cursor: "pointer" }} />
        </Tooltip>
      </div>
      <div>
        <p>{message}</p>
      </div>
    </motion.div>
  );
}
