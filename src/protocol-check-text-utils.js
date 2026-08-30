export function createProtocolCheckTextHelpers({
  safe,
  simpleNorm
}){
  function wordCheck(value){
    return value ? "☒" : "☐";
  }

  function protocolCheckedText(items){
    return items.map(item=>`${wordCheck(!!item.checked)} ${item.label}`).join("   ");
  }

  function protocolBackedDevicesText(protocol={}){
    const d=protocol.backedDevices || {};
    return protocolCheckedText([
      {checked:d.lift,label:"Výtah"},
      {checked:d.vent,label:"vent. výt. šachty"},
      {checked:d.machineLight,label:"osvětlení strojovny"},
      {checked:d.chuc,label:"CHÚC"},
      {checked:d.damper,label:"klapka"},
      {checked:d.skylight,label:"světlík"},
      {checked:d.gate,label:"vrata"},
      {checked:d.ats,label:"ATS"},
      {checked:d.rpo,label:"RPO"},
      {checked:d.no,label:"NO"},
      {checked:d.sprinkler,label:"sprinkler"},
      {checked:d.csTs,label:"CS/TS"},
      {checked:safe(d.other),label:`jiné: ${safe(d.other)}`}
    ]);
  }

  function protocolAccessText(protocol={}){
    const d=protocol.access || {};
    return protocolCheckedText([
      {checked:d.blue,label:"modrá"},
      {checked:d.b,label:"B"},
      {checked:d.c,label:"C"},
      {checked:d.garage,label:"garáže"},
      {checked:d.carLift,label:"auto výtah"},
      {checked:d.barrier,label:"závora"},
      {checked:d.parkingHouse,label:"park. dům"},
      {checked:d.permit,label:"povolení"},
      {checked:d.training,label:"školení"},
      {checked:d.shoes,label:"boty"},
      {checked:d.vest,label:"vesta"},
      {checked:d.helmet,label:"helma"},
      {checked:safe(d.other),label:`jiné: ${safe(d.other)}`}
    ]);
  }

  function protocolAvailabilityText(protocol={}){
    const d=protocol.availability || {};
    return [
      `WC ${wordCheck(d.wcOk)} Ok / ${wordCheck(d.wcNok)} Nok`,
      `Osvětlení ${wordCheck(d.lightOk)} Ok / ${wordCheck(d.lightNok)} Nok`,
      protocolCheckedText([
        {checked:d.ladder,label:"žebřík"},
        {checked:d.stairs,label:"schody"},
        {checked:d.lowCeiling,label:"snížený strop"},
        {checked:d.extremeTemp,label:"extrémní teploty"},
        {checked:safe(d.other),label:`jiné: ${safe(d.other)}`}
      ])
    ].join("   ");
  }

  function protocolPeriodText(protocol={}){
    const period=simpleNorm(protocol.period);
    return `${wordCheck(period.includes("6"))} 6 měsíců / ${wordCheck(period.includes("12"))} 12 měsíců`;
  }

  function protocolConditionsText(protocol={}){
    const n=simpleNorm(protocol.conditions || protocol.result);
    const base=`${wordCheck(n==="ano" || n==="ok")} ano / ${wordCheck(n==="ne" || n==="nok")} ne`;
    return safe(protocol.conditionsReason) ? `${base}\nOdůvodnění: ${protocol.conditionsReason}` : base;
  }

  return {
    protocolAccessText,
    protocolAvailabilityText,
    protocolBackedDevicesText,
    protocolConditionsText,
    protocolPeriodText,
    wordCheck
  };
}
