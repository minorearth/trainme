"use client";
import unit from "@/components/unitrun/layers/store/unit";

import { observer } from "mobx-react-lite";
import { TT } from "@/tpconst/src/const";
import Guide from "./guide/guide";
import Task from "./task/task";

const BottomPanel = observer(() => {
  if (unit.currUnit.unittype == TT.task) return <Task />;
  if (unit.currUnit.unittype == TT.guide) return <Guide />;
});

export default BottomPanel;
