import React from "react";
import LottieLoading from "./LottieLoading";

export default function Loading({size, speed}) {
  return (
    <div id="loading">
      <LottieLoading speed={speed} size={size} />
    </div>
  );
}
