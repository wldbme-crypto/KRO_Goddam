import { calculateElementModifier } from "./elementCalculator";

export interface SkillDamageResult {
  min: number;
  max: number;
  avg: number;
}

export interface SkillDamageParams {
  skillId: string;
  skillMatk: number;
  baseLevel: number;
  totalSPL: number;
  splCoeff: number;
  finalMatkMin: number;
  finalMatkMax: number;
  skillDamageBonus: number;
  warmWind: number;
  monsterElement: number;
  monsterMres: number;
  monsterRatio: number;
}

export function calculateSkillDamage(params: SkillDamageParams): SkillDamageResult {
  const {
    skillMatk,
    baseLevel,
    totalSPL,
    splCoeff,
    finalMatkMin,
    finalMatkMax,
    skillDamageBonus,
    warmWind,
    monsterElement,
    monsterMres,
    monsterRatio
  } = params;

  const levelCoeff = baseLevel / 100;
  const skillFinal = (skillMatk + (splCoeff * totalSPL)) * levelCoeff;
  const basicSkillMin = Math.floor(skillFinal * (finalMatkMin * 0.01));
  const basicSkillMax = Math.floor(skillFinal * (finalMatkMax * 0.01));

  const skillDamageCorrection = Math.floor((skillDamageBonus / 100 + 1) * 1000) / 1000;

  const skillDamageMin = Math.floor(skillDamageCorrection * basicSkillMin);
  const skillDamageMax = Math.floor(skillDamageCorrection * basicSkillMax);

  const elementModifier = calculateElementModifier(warmWind, monsterElement) / 100;
  const elementLevelMin = Math.floor(skillDamageMin * elementModifier);
  const elementLevelMax = Math.floor(skillDamageMax * elementModifier);

  // 저항 수치 적용
  const resistanceModifier = (2000 + monsterMres) / (2000 + monsterMres * 5);
  const resistanceAppliedMin = Math.floor(elementLevelMin * resistanceModifier);
  const resistanceAppliedMax = Math.floor(elementLevelMax * resistanceModifier);

  // 데미지비율 적용
  const finalDamageMin = Math.floor(resistanceAppliedMin * (monsterRatio / 100));
  const finalDamageMax = Math.floor(resistanceAppliedMax * (monsterRatio / 100));

  // 평균 계산
  const finalDamageAvg = Math.floor((finalDamageMin + finalDamageMax) / 2);

  return {
    min: finalDamageMin,
    max: finalDamageMax,
    avg: finalDamageAvg
  };
}
