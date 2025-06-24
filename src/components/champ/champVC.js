"use client";
import { useState, useEffect } from "react";
import champ from "@/components/champ/layers/store/champ";
import { captureAndLaunchChamp } from "@/components/champ/layers/services/services";
import { reaction } from "mobx";

const useChamps = () => {
  useEffect(() => {
    return reaction(
      () => champ.capturingChampstart,
      () => {
        if (!champ.capturingChampstart) return;
        captureAndLaunchChamp();
      }
    );
  }, []);
};

export default useChamps;
