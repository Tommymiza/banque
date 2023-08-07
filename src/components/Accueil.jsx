import React, { useContext } from "react";
import { ActContext } from "../App";
import CompteAdmin from "./CompteAdmin";
import CompteClient from "./CompteClient";

export default function Accueil() {
  const { user } = useContext(ActContext);
  return <div>
    {user.type === "admin" ? (
      <CompteAdmin />
    ) : (
      <CompteClient />
    )}
  </div>;
}
