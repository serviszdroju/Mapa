export function protocolMeasurementTableSpec(protocol={}){
  const w=[1070,1070,1070,1070,1070,1070,1070,1070,1070];
  const label={bold:true,size:17,fill:"F2F2F2",align:"center"};
  const value={size:18,align:"center",height:330};
  return {
    widths:w,
    rows:[
      [
        {...label,text:"Počet baterií: (ks)"},
        {...label,text:"Kapacita (Ah)"},
        {...label,text:"Počet sad (ks)",colSpan:2},
        {...label,text:"Pom. Bat (Ah)",colSpan:2},
        {...label,text:"Teplota okolí (°C)",colSpan:2},
        {...label,text:"Plomba"}
      ],
      [
        {...value,text:protocol.batteryCount},
        {...value,text:protocol.capacityAh},
        {...value,text:protocol.setCount,colSpan:2},
        {...value,text:protocol.auxBatteryAh,colSpan:2},
        {...value,text:protocol.temperature,colSpan:2},
        {...value,text:protocol.seal2}
      ],
      [
        {...label,text:"Vstup (Vac)"},
        {...label,text:"Výstup 1 (Vac)",colSpan:2},
        {...label,text:"Výstup 2 (Vac)",colSpan:2},
        {...label,text:"Výstup zál. 1 (Vac)",colSpan:2},
        {...label,text:"Výstup zál. 2 (Vac)",colSpan:2}
      ],
      [
        {...value,text:protocol.inputVac},
        {...value,text:protocol.output1Vac,colSpan:2},
        {...value,text:protocol.output2Vac,colSpan:2},
        {...value,text:protocol.backup1Vac,colSpan:2},
        {...value,text:protocol.backup2Vac,colSpan:2}
      ],
      [
        {...label,text:"Hl. bat. 1 (Vdc)"},
        {...label,text:"Reset Diagnostiky",colSpan:2},
        {...label,text:"Pom. bat. (Vdc)",colSpan:2},
        {...label,text:"Rozvážení 1 (Vdc)",colSpan:2},
        {...label,text:"Rozvážení 2 (Vdc)",colSpan:2}
      ],
      [
        {...value,text:protocol.mainBatVdc},
        {...value,text:protocol.resetDiagnostics,colSpan:2},
        {...value,text:protocol.auxBatVdc,colSpan:2},
        {...value,text:protocol.unbalance1,colSpan:2},
        {...value,text:protocol.unbalance2,colSpan:2}
      ]
    ]
  };
}
