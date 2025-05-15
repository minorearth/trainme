"use client";
import { useState, useEffect } from "react";

import stn from "@/globals/settings";

const usePivot = ({ champid }) => {
  const [rows, setRowsx] = useState([]);
  const [started, setStarted] = useState(false);

  return {
    rows,
  };
};

export default usePivot;
