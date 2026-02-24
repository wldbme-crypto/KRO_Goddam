import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { BuffBonus } from "../utils/buffCalculator";
import { calculateElementModifier } from "../utils/elementCalculator";
import { MONSTER_LIST } from "../data/monsterData";
import { ActiveSkillFormula } from "./SkillTree";

export interface SkillDamageResult {
  min: number;
  max: number;
  avg: number;
}

export interface SkillDamages {
  chungyong: SkillDamageResult;
  backho: SkillDamageResult;
  jujak: SkillDamageResult;
  hyunmu: SkillDamageResult;
  sabangsin: SkillDamageResult;
  sabangohaeng: SkillDamageResult;
}

interface Stats {
  STR: number;
  AGI: number;
  VIT: number;
  INT: number;
  DEX: number;
  LUK: number;
}

interface StatBonus {
  STR: number;
  AGI: number;
  VIT: number;
  INT: number;
  DEX: number;
  LUK: number;
}

interface TraitStats {
  POW: number;
  STA: number;
  WIS: number;
  SPL: number;
  CON: number;
  CRT: number;
}

interface TraitStatBonus {
  POW: number;
  STA: number;
  WIS: number;
  SPL: number;
  CON: number;
  CRT: number;
}

interface DamageCalculationProps {
  baseLevel: number;
  stats: Stats;
  statBonus: StatBonus;
  traitStats: TraitStats;
  traitStatBonus: TraitStatBonus;
  weaponGrade: "A등급" | "B등급" | "C등급" | "D등급" | "무등급";
  weaponRefine: number;
  baseWeaponDamage: number;
  statusMatkCorrection: number;
  equipMatkMax: number;
  weaponMatk: number;
  calculatedEquipMatk: number;
  matkPercent: number;
  smatk: number;
  general: number;
  boss: number;
  allSize: number;
  small: number;
  medium: number;
  large: number;
  allElement: number;
  neutral: number;
  water: number;
  earth: number;
  fire: number;
  wind: number;
  poison: number;
  holy: number;
  shadow: number;
  ghost: number;
  undead: number;
  allRace: number;
  plant: number;
  undeadRace: number;
  formless: number;
  angel: number;
  dragon: number;
  fish: number;
  insect: number;
  brute: number;
  demon: number;
  demiHuman: number;
  allMagic: number;
  variableMagic: number;
  windMagic: number;
  waterMagic: number;
  fireMagic: number;
  ghostMagic: number;
  shadowMagic: number;
  holyMagic: number;
  neutralMagic: number;
  poisonMagic: number;
  undeadMagic: number;
  buffBonus: BuffBonus;
  skillDamageBonus: {
    chungyong: number;
    backho: number;
    jujak: number;
    hyunmu: number;
    sabangsin: number;
    sabangohaeng: number;
    saryoung: number;
  };
  skillLevels: Record<string, number>;
  monsterSize: string;
  monsterElement: string;
  monsterRace: string;
  monsterGrade: string;
  warmWind: string;
  monsterName: string;
  resistanceIgnore: number;
  activeSkillFormulas: ActiveSkillFormula[];
  isSabangBuffActive: boolean;
  onDamageCalculated?: (damages: SkillDamages) => void;
}

interface CalculationRow {
  label: string;
  base: number | string;
  buff: number | string;
  equipment: number;
  total: number;
  correction: number | string;
  formula: string;
}

export function DamageCalculation({
  baseLevel,
  stats,
  statBonus,
  traitStats,
  traitStatBonus,
  weaponGrade,
  weaponRefine,
  baseWeaponDamage,
  statusMatkCorrection,
  equipMatkMax,
  weaponMatk,
  calculatedEquipMatk,
  matkPercent,
  smatk,
  general,
  boss,
  allSize,
  small,
  medium,
  large,
  allElement,
  neutral,
  water,
  earth,
  fire,
  wind,
  poison,
  holy,
  shadow,
  ghost,
  undead,
  allRace,
  plant,
  undeadRace,
  formless,
  angel,
  dragon,
  fish,
  insect,
  brute,
  demon,
  demiHuman,
  allMagic,
  variableMagic,
  windMagic,
  waterMagic,
  fireMagic,
  ghostMagic,
  shadowMagic,
  holyMagic,
  neutralMagic,
  poisonMagic,
  undeadMagic,
  buffBonus,
  skillDamageBonus,
  skillLevels,
  monsterSize,
  monsterElement,
  monsterRace,
  monsterGrade,
  warmWind,
  monsterName,
  resistanceIgnore,
  activeSkillFormulas,
  isSabangBuffActive,
  onDamageCalculated,
}: DamageCalculationProps) {
  // 몬스터 이름으로 MRES 조회 및 저항무시 적용
  const getMonsterMres = (name: string, resistIgnore: number): number => {
    const monster = MONSTER_LIST.find(m => m.name === name);
    if (monster && monster.mres) {
      const mresValue = parseInt(monster.mres);
      if (isNaN(mresValue)) return 0;
      // MRES = 현재값 * (1 - 저항���시%)
      return Math.floor(mresValue * (1 - resistIgnore / 100));
    }
    return 0;
  };

  const monsterMres = getMonsterMres(monsterName, resistanceIgnore);

  // 몬스터 이름으로 데미지비율 조회
  const getMonsterRatio = (name: string): number => {
    const monster = MONSTER_LIST.find(m => m.name === name);
    if (monster && monster.ratio) {
      const ratioValue = parseInt(monster.ratio);
      if (isNaN(ratioValue)) return 100; // 기본값 100%
      return ratioValue;
    }
    return 100; // 기본값 100%
  };

  const monsterRatio = getMonsterRatio(monsterName);

  // 무기제련 MATK 테이블
  const refinementMatkTable: Record<string, Record<number, number>> = {
    "A등급": { 0: 0, 1: 16, 2: 32, 3: 48, 4: 64, 5: 80, 6: 96, 7: 112, 8: 128, 9: 144, 10: 160, 11: 176, 12: 192, 13: 208, 14: 224, 15: 240, 16: 256, 17: 272, 18: 288, 19: 304, 20: 320 },
    "B등급": { 0: 0, 1: 12, 2: 24, 3: 36, 4: 48, 5: 60, 6: 72, 7: 84, 8: 96, 9: 108, 10: 120, 11: 132, 12: 144, 13: 156, 14: 168, 15: 180, 16: 192, 17: 204, 18: 216, 19: 228, 20: 240 },
    "C등급": { 0: 0, 1: 10, 2: 20, 3: 30, 4: 40, 5: 50, 6: 60, 7: 70, 8: 80, 9: 90, 10: 100, 11: 110, 12: 120, 13: 130, 14: 140, 15: 150, 16: 160, 17: 170, 18: 180, 19: 190, 20: 200 },
    "D등급": { 0: 0, 1: 9, 2: 18, 3: 27, 4: 36, 5: 45, 6: 54, 7: 63, 8: 72, 9: 81, 10: 90, 11: 99, 12: 108, 13: 117, 14: 126, 15: 135, 16: 144, 17: 153, 18: 162, 19: 171, 20: 180 },
    "무등급": { 0: 0, 1: 8, 2: 16, 3: 24, 4: 32, 5: 40, 6: 48, 7: 56, 8: 64, 9: 72, 10: 80, 11: 88, 12: 96, 13: 104, 14: 112, 15: 120, 16: 128, 17: 136, 18: 144, 19: 152, 20: 160 },
  };

  // 무기제련 MATK 값 조회
  const weaponRefinementMatk = refinementMatkTable[weaponGrade]?.[weaponRefine] ?? 0;

  // 무기등급 표시값 변환 (등급 제거, 무등급은 0으로)
  const weaponGradeDisplay = weaponGrade === "무등급" ? "0" : weaponGrade.replace("등급", "");

  // 분산데미지(최저) 계산
  const minVarianceDamage = Math.floor((-0.1 * 5) * (baseWeaponDamage + weaponRefinementMatk));

  // 분산데미지(최대) 계산
  const maxVarianceDamage = Math.floor((0.1 * 5) * (baseWeaponDamage + weaponRefinementMatk));

  // 무기MATK(최저/최대) 계산
  const minWeaponMatk = weaponRefinementMatk + baseWeaponDamage + minVarianceDamage;
  const maxWeaponMatk = weaponRefinementMatk + baseWeaponDamage + maxVarianceDamage;

  // 총 합계 값 계산
  const totalINT = stats.INT + statBonus.INT;
  const totalDEX = stats.DEX + statBonus.DEX;
  const totalLUK = stats.LUK + statBonus.LUK;
  const totalSPL = traitStats.SPL + traitStatBonus.SPL;

  // 각 보정값 계산
  const levelCorrection = Math.floor(baseLevel / 4);
  const intCorrection = Math.floor(totalINT / 2);
  const dexCorrection = Math.floor(totalDEX / 5);
  const lukCorrection = Math.floor(totalLUK / 3);
  const splCorrection = Math.floor(totalSPL * 5);

  // MATK % 및 SMATK 계산
  const matkPercentTotal = matkPercent + (buffBonus['MATK %'] || 0);
  const matkPercentCorrection = Math.floor((1 + matkPercentTotal / 100) * 1000) / 1000;

  const smatkTotal = smatk + (buffBonus.SMATK || 0);
  const smatkCorrection = Math.floor((1 + smatkTotal / 100) * 1000) / 1000;

  // FINAL MATK MIN/MAX 계산
  const finalMatkMin = statusMatkCorrection + calculatedEquipMatk + minWeaponMatk;
  const finalMatkMax = statusMatkCorrection + calculatedEquipMatk + maxWeaponMatk;

  // 몬스터 크기에 따른 사이즈 보정값 계산
  const getSizeCorrection = (): number => {
    const normalizedSize = monsterSize.trim();
    if (normalizedSize === "소형") {
      return Math.floor((1 + (allSize + small + (buffBonus.size || 0)) / 100) * 1000) / 1000;
    } else if (normalizedSize === "중형") {
      return Math.floor((1 + (allSize + medium + (buffBonus.size || 0)) / 100) * 1000) / 1000;
    } else if (normalizedSize === "대형") {
      return Math.floor((1 + (allSize + large + (buffBonus.size || 0)) / 100) * 1000) / 1000;
    }
    return 1.000; // 기본값
  };

  const sizeCorrection = getSizeCorrection();

  // 몬스터 속성에 따른 속성적 보정값 계산
  const getElementCorrection = (): number => {
    // 몬스터 속성에서 숫자를 제외한 문자만 추출
    const elementText = monsterElement.replace(/[0-9]/g, '').trim();
    
    // calculations 배열의 인덱스 29-39 label과 정확히 매칭
    if (elementText === "무속성") {
      return Math.floor((1 + (allElement + neutral) / 100) * 1000) / 1000;
    } else if (elementText === "수속성") {
      return Math.floor((1 + (allElement + water) / 100) * 1000) / 1000;
    } else if (elementText === "지속성") {
      return Math.floor((1 + (allElement + earth) / 100) * 1000) / 1000;
    } else if (elementText === "화속성") {
      return Math.floor((1 + (allElement + fire) / 100) * 1000) / 1000;
    } else if (elementText === "풍속성") {
      return Math.floor((1 + (allElement + wind) / 100) * 1000) / 1000;
    } else if (elementText === "독속성") {
      return Math.floor((1 + (allElement + poison) / 100) * 1000) / 1000;
    } else if (elementText === "성속성") {
      return Math.floor((1 + (allElement + holy) / 100) * 1000) / 1000;
    } else if (elementText === "암속성") {
      return Math.floor((1 + (allElement + shadow) / 100) * 1000) / 1000;
    } else if (elementText === "염속성") {
      return Math.floor((1 + (allElement + ghost) / 100) * 1000) / 1000;
    } else if (elementText === "불사속성") {
      return Math.floor((1 + (allElement + undead) / 100) * 1000) / 1000;
    }
    return 1.000; // 기본값
  };

  const elementCorrection = getElementCorrection();

  // 몬스터 종족에 따른 종족적 보정값 계산
  const getRaceCorrection = (): number => {
    const raceText = monsterRace.trim();
    
    // calculations 배열의 종족 label과 정확히 매칭
    if (raceText === "식물형") {
      return Math.floor((1 + (allRace + plant + (buffBonus.plant || 0)) / 100) * 1000) / 1000;
    } else if (raceText === "불사형") {
      return Math.floor((1 + (allRace + undeadRace + (buffBonus.undeadRace || 0)) / 100) * 1000) / 1000;
    } else if (raceText === "무형") {
      return Math.floor((1 + (allRace + formless + (buffBonus.formless || 0)) / 100) * 1000) / 1000;
    } else if (raceText === "천사형") {
      return Math.floor((1 + (allRace + angel + (buffBonus.angel || 0)) / 100) * 1000) / 1000;
    } else if (raceText === "용족") {
      return Math.floor((1 + (allRace + dragon + (buffBonus.dragon || 0)) / 100) * 1000) / 1000;
    } else if (raceText === "어패형") {
      return Math.floor((1 + (allRace + fish + (buffBonus.fish || 0)) / 100) * 1000) / 1000;
    } else if (raceText === "곤충형") {
      return Math.floor((1 + (allRace + insect + (buffBonus.insect || 0)) / 100) * 1000) / 1000;
    } else if (raceText === "동물형") {
      return Math.floor((1 + (allRace + brute + (buffBonus.brute || 0)) / 100) * 1000) / 1000;
    } else if (raceText === "악마형") {
      return Math.floor((1 + (allRace + demon + (buffBonus.demon || 0)) / 100) * 1000) / 1000;
    } else if (raceText === "인간형") {
      return Math.floor((1 + (allRace + demiHuman + (buffBonus.demiHuman || 0)) / 100) * 1000) / 1000;
    }
    return 1.000; // 기본값
  };

  const raceCorrection = getRaceCorrection();

  // 몬스터 등급에 따른 등급 보정값 계산
  const getGradeCorrection = (): number => {
    const gradeText = monsterGrade.trim();
    
    // calculations 배열의 등급 label과 정확히 매칭
    if (gradeText === "일반적") {
      return Math.floor((1 + general / 100) * 1000) / 1000;
    } else if (gradeText === "보스형") {
      return Math.floor((1 + boss / 100) * 1000) / 1000;
    }
    return 1.000; // 기본값
  };

  const gradeCorrection = getGradeCorrection();

  // 따뜻한바람의 속성에 따른 속성 마법 보정값 계산
  const getMagicElementCorrection = (): number => {
    if (!warmWind) return 1.000; // 선택 안 함

    // warmWind 값에 따라 해당 속성 마법 보정값 반환
    if (warmWind === "variableMagic") {
      return Math.floor((1 + (allMagic + (buffBonus.allMagic || 0) + variableMagic) / 100) * 1000) / 1000;
    } else if (warmWind === "windMagic") {
      return Math.floor((1 + (allMagic + (buffBonus.allMagic || 0) + windMagic) / 100) * 1000) / 1000;
    } else if (warmWind === "waterMagic") {
      return Math.floor((1 + (allMagic + (buffBonus.allMagic || 0) + waterMagic) / 100) * 1000) / 1000;
    } else if (warmWind === "fireMagic") {
      return Math.floor((1 + (allMagic + (buffBonus.allMagic || 0) + fireMagic) / 100) * 1000) / 1000;
    } else if (warmWind === "ghostMagic") {
      return Math.floor((1 + (allMagic + (buffBonus.allMagic || 0) + ghostMagic) / 100) * 1000) / 1000;
    } else if (warmWind === "shadowMagic") {
      return Math.floor((1 + (allMagic + (buffBonus.allMagic || 0) + shadowMagic) / 100) * 1000) / 1000;
    } else if (warmWind === "holyMagic") {
      return Math.floor((1 + (allMagic + (buffBonus.allMagic || 0) + holyMagic) / 100) * 1000) / 1000;
    } else if (warmWind === "neutralMagic") {
      return Math.floor((1 + (allMagic + (buffBonus.allMagic || 0) + neutralMagic) / 100) * 1000) / 1000;
    } else if (warmWind === "poisonMagic") {
      return Math.floor((1 + (allMagic + (buffBonus.allMagic || 0) + poisonMagic) / 100) * 1000) / 1000;
    } else if (warmWind === "undeadMagic") {
      return Math.floor((1 + (allMagic + (buffBonus.allMagic || 0) + undeadMagic) / 100) * 1000) / 1000;
    }
    return 1.000; // 기본값
  };

  const magicElementCorrection = getMagicElementCorrection();

  // FINAL MATK(MIN) 계산
  const calculateFinalMatkMin = (): number => {
    const result = finalMatkMin * matkPercentCorrection * sizeCorrection * elementCorrection * magicElementCorrection * raceCorrection * gradeCorrection * smatkCorrection;
    return Math.floor(result);
  };

  const finalMatkMinResult = calculateFinalMatkMin();

  // FINAL MATK(MAX) 계산
  const calculateFinalMatkMax = (): number => {
    const result = finalMatkMax * matkPercentCorrection * sizeCorrection * elementCorrection * magicElementCorrection * raceCorrection * gradeCorrection * smatkCorrection;
    return Math.floor(result);
  };

  const finalMatkMaxResult = calculateFinalMatkMax();

  // 사방신 스킬 데이터 정의
  const sabangsinSkills = [
    { id: 'chungyong', name: '청룡부', splCoeff: 5 },
    { id: 'backho', name: '백호부', splCoeff: 5 },
    { id: 'jujak', name: '주작부', splCoeff: 5 },
    { id: 'hyunmu', name: '현무부', splCoeff: 5 },
    { id: 'sabangsin', name: '사방신부', splCoeff: 5 },
    { id: 'sabangohaeng', name: '사방오행진', splCoeff: 50 },
  ];

  // 스킬 공식 데이터 (B-1-3에서 가져온 데이터)
  const skillFormulas: Record<string, { level: number; normalMatk: number; buffMatk: number }[]> = {
    chungyong: [
      { level: 1, normalMatk: 3100, buffMatk: 3900 },
      { level: 2, normalMatk: 5350, buffMatk: 6850 },
      { level: 3, normalMatk: 7600, buffMatk: 9800 },
      { level: 4, normalMatk: 9850, buffMatk: 12750 },
      { level: 5, normalMatk: 12100, buffMatk: 15700 },
    ],
    backho: [
      { level: 1, normalMatk: 1300, buffMatk: 1800 },
      { level: 2, normalMatk: 2400, buffMatk: 3200 },
      { level: 3, normalMatk: 3400, buffMatk: 4600 },
      { level: 4, normalMatk: 4400, buffMatk: 6000 },
      { level: 5, normalMatk: 5400, buffMatk: 7400 },
    ],
    jujak: [
      { level: 1, normalMatk: 2850, buffMatk: 3450 },
      { level: 2, normalMatk: 4300, buffMatk: 5300 },
      { level: 3, normalMatk: 5750, buffMatk: 7150 },
      { level: 4, normalMatk: 7200, buffMatk: 9000 },
      { level: 5, normalMatk: 8650, buffMatk: 10850 },
    ],
    hyunmu: [
      { level: 1, normalMatk: 3750, buffMatk: 4400 },
      { level: 2, normalMatk: 5350, buffMatk: 6500 },
      { level: 3, normalMatk: 6950, buffMatk: 8600 },
      { level: 4, normalMatk: 8550, buffMatk: 10700 },
      { level: 5, normalMatk: 10150, buffMatk: 12800 },
    ],
    sabangsin: [
      { level: 1, normalMatk: 300, buffMatk: 2100 },
      { level: 2, normalMatk: 550, buffMatk: 3850 },
      { level: 3, normalMatk: 800, buffMatk: 5600 },
      { level: 4, normalMatk: 1050, buffMatk: 7350 },
      { level: 5, normalMatk: 1300, buffMatk: 9100 },
    ],
    sabangohaeng: [
      { level: 1, normalMatk: 12500, buffMatk: 0 },
      { level: 2, normalMatk: 22500, buffMatk: 0 },
      { level: 3, normalMatk: 32500, buffMatk: 0 },
      { level: 4, normalMatk: 42500, buffMatk: 0 },
      { level: 5, normalMatk: 52500, buffMatk: 0 },
    ],
  };

  // 각 스킬의 스킬% 값을 가져오는 함수 (B-1-3 활성화된 스킬 공식 사용)
  const getSkillMatk = (skillId: string): number => {
    // skillId를 스킬 이름으로 매핑
    const skillIdToName: Record<string, string> = {
      'chungyong': '청룡부',
      'backho': '백호부',
      'jujak': '주작부',
      'hyunmu': '현무부',
      'sabangsin': '사방신부',
      'sabangohaeng': '사방오행진',
    };
    
    const skillName = skillIdToName[skillId];
    if (!skillName) return 0;
    
    // activeSkillFormulas에서 해당 스킬 찾기
    const formula = activeSkillFormulas.find(f => f.name === skillName);
    if (!formula) return 0;
    
    // 부적연마와 영도술 연마 레벨 가져오기
    const bujukLevel = skillLevels["bujuk"] || 0;
    const youngdoLevel = skillLevels["youngdo"] || 0;
    
    // 사방오행진 버프가 적용되는 경우 buffMatk 사용, 아니면 normalMatk 사용
    const hasSabangBuff = formula.buffName === "사방오행진";
    const baseMatk = (isSabangBuffActive && hasSabangBuff) ? formula.buffMatk : formula.normalMatk;
    
    // 공식에 따라 추가 데미지 계산 (B-1-3의 로직과 동일하게)
    let additionalMatk = 0;
    if (skillName === "사방오행진") {
      // 사방오행진: (부적연마LV+영도술 연마LV)*배수
      const multiplier = formula.level * 15; // LV1=15, LV2=30, LV3=45, LV4=60, LV5=75
      additionalMatk = (bujukLevel + youngdoLevel) * multiplier;
    } else if (skillName === "사령정화") {
      // 사령정화: (영도술 연마LV*2)*20
      additionalMatk = (youngdoLevel * 2) * 20;
    } else {
      // 기타 스킬: 부적연마LV*배수
      const multiplier = formula.level * 15; // LV1=15, LV2=30, LV3=45, LV4=60, LV5=75
      additionalMatk = bujukLevel * multiplier;
    }
    
    const totalMatk = baseMatk + additionalMatk;
    return totalMatk;
  };

  // 계산 로우 데이터 생성
  const calculations: CalculationRow[] = [
    {
      label: "BASE LEVEL",
      base: baseLevel,
      buff: 0,
      equipment: 0,
      total: baseLevel,
      correction: levelCorrection,
      formula: "BASE LEVEL/4",
    },
    {
      label: "INT",
      base: totalINT,
      buff: buffBonus.INT || 0,
      equipment: 0,
      total: totalINT + (buffBonus.INT || 0),
      correction: Math.floor((totalINT + (buffBonus.INT || 0)) / 2),
      formula: "INT/2",
    },
    {
      label: "DEX",
      base: totalDEX,
      buff: buffBonus.DEX || 0,
      equipment: 0,
      total: totalDEX + (buffBonus.DEX || 0),
      correction: Math.floor((totalDEX + (buffBonus.DEX || 0)) / 5),
      formula: "DEX/5",
    },
    {
      label: "LUK",
      base: totalLUK,
      buff: buffBonus.LUK || 0,
      equipment: 0,
      total: totalLUK + (buffBonus.LUK || 0),
      correction: Math.floor((totalLUK + (buffBonus.LUK || 0)) / 3),
      formula: "LUK/3",
    },
    {
      label: "SPL",
      base: totalSPL,
      buff: 0,
      equipment: 0,
      total: totalSPL,
      correction: splCorrection,
      formula: "SPL*5",
    },
    {
      label: "STATUS MATK",
      base: 0,
      buff: 0,
      equipment: 0,
      total: 0,
      correction: statusMatkCorrection,
      formula: "INT 기본+레벨보정+INT보정+DEX보정+LUK보정+SPL보정",
    },
    {
      label: "EQUIP MATK",
      base: equipMatkMax,
      buff: 0,
      equipment: 0,
      total: equipMatkMax,
      correction: equipMatkMax,
      formula: "뒷 MATK : 방어구 MATK + 무기 MATK",
    },
    {
      label: "EXTRA MATK",
      base: calculatedEquipMatk,
      buff: 0,
      equipment: 0,
      total: calculatedEquipMatk,
      correction: calculatedEquipMatk,
      formula: "무기를 제외한 전체 장비의 뒷 MATK",
    },
    {
      label: "무기레벨",
      base: 5,
      buff: 0,
      equipment: 0,
      total: 5,
      correction: 5,
      formula: "",
    },
    {
      label: "무기등급",
      base: weaponGradeDisplay as any,
      buff: 0,
      equipment: 0,
      total: weaponGradeDisplay as any,
      correction: weaponGradeDisplay as any,
      formula: "",
    },
    {
      label: "무기제련도",
      base: weaponRefine,
      buff: 0,
      equipment: 0,
      total: weaponRefine,
      correction: weaponRefine,
      formula: "",
    },
    {
      label: "기본무기데미지",
      base: baseWeaponDamage,
      buff: 0,
      equipment: 0,
      total: baseWeaponDamage,
      correction: baseWeaponDamage,
      formula: "",
    },
    {
      label: "무기제련MATK",
      base: weaponRefinementMatk,
      buff: 0,
      equipment: 0,
      total: weaponRefinementMatk,
      correction: weaponRefinementMatk,
      formula: "REFINEMENT BONUS 무기등급/제련도에 따른 MATK",
    },
    {
      label: "WEAPON MATK",
      base: weaponRefinementMatk + baseWeaponDamage,
      buff: 0,
      equipment: 0,
      total: weaponRefinementMatk + baseWeaponDamage,
      correction: weaponRefinementMatk + baseWeaponDamage,
      formula: "무기제련MATK + 기본무기데미지",
    },
    {
      label: "분산데미지(최저)",
      base: minVarianceDamage,
      buff: 0,
      equipment: 0,
      total: minVarianceDamage,
      correction: minVarianceDamage,
      formula: "(-0.1 * 5) * (기본무기데미지 + 무기제련MATK)",
    },
    {
      label: "분산데미지(최대)",
      base: maxVarianceDamage,
      buff: 0,
      equipment: 0,
      total: maxVarianceDamage,
      correction: maxVarianceDamage,
      formula: "(0.1 * 5) * (기본무기데미지 + 무기제련MATK)",
    },
    {
      label: "무기MATK(최저)",
      base: minWeaponMatk,
      buff: 0,
      equipment: 0,
      total: minWeaponMatk,
      correction: minWeaponMatk,
      formula: "무기제련MATK + 기본무기데미지 + 분산데미지(최저)",
    },
    {
      label: "무기MATK(최대)",
      base: maxWeaponMatk,
      buff: 0,
      equipment: 0,
      total: maxWeaponMatk,
      correction: maxWeaponMatk,
      formula: "무기제련MATK + 기본무기데미지 + 분산데미지(최대)",
    },
    {
      label: "FINAL MATK MIN",
      base: finalMatkMin,
      buff: 0,
      equipment: 0,
      total: finalMatkMin,
      correction: finalMatkMin,
      formula: "STATUS MATK + EXTRA MATK + 무기MATK(최저)",
    },
    {
      label: "FINAL MATK MAX",
      base: finalMatkMax,
      buff: 0,
      equipment: 0,
      total: finalMatkMax,
      correction: finalMatkMax,
      formula: "STATUS MATK + EXTRA MATK + 무기MATK(최대)",
    },
    {
      label: "MATK %",
      base: matkPercent,
      buff: buffBonus['MATK %'] || 0,
      equipment: 0,
      total: matkPercentTotal,
      correction: matkPercentCorrection,
      formula: "1+MATK %",
    },
    {
      label: "SMATK",
      base: smatk,
      buff: buffBonus.SMATK || 0,
      equipment: 0,
      total: smatkTotal,
      correction: smatkCorrection,
      formula: "1+SMATK/100",
    },
    {
      label: "일반적",
      base: general,
      buff: 0,
      equipment: 0,
      total: general,
      correction: Math.floor((1 + general / 100) * 1000) / 1000,
      formula: "1+일반적%/100",
    },
    {
      label: "보스형",
      base: boss,
      buff: 0,
      equipment: 0,
      total: boss,
      correction: Math.floor((1 + boss / 100) * 1000) / 1000,
      formula: "1+보스형%/100",
    },
    {
      label: "모든 크기 적",
      base: allSize,
      buff: 0,
      equipment: 0,
      total: allSize,
      correction: "",
      formula: "",
    },
    {
      label: "소형",
      base: small,
      buff: 0,
      equipment: 0,
      total: small,
      correction: sizeCorrection,
      formula: "1+(모든 크기 적+소형)/100",
    },
    {
      label: "중형",
      base: medium,
      buff: 0,
      equipment: 0,
      total: medium,
      correction: sizeCorrection,
      formula: "1+(모든 크기 적+중형)/100",
    },
    {
      label: "대형",
      base: large,
      buff: 0,
      equipment: 0,
      total: large,
      correction: sizeCorrection,
      formula: "1+(모든 크기 적+대형)/100",
    },
    {
      label: "모든 속성 적",
      base: allElement,
      buff: 0,
      equipment: 0,
      total: allElement,
      correction: "",
      formula: "",
    },
    {
      label: "무속성",
      base: neutral,
      buff: buffBonus.neutral || 0,
      equipment: 0,
      total: neutral + (buffBonus.neutral || 0),
      correction: Math.floor((1 + (allElement + neutral + (buffBonus.neutral || 0)) / 100) * 1000) / 1000,
      formula: "1+(모든 속성 적+무속성)/100",
    },
    {
      label: "수속성",
      base: water,
      buff: buffBonus.water || 0,
      equipment: 0,
      total: water + (buffBonus.water || 0),
      correction: Math.floor((1 + (allElement + water + (buffBonus.water || 0)) / 100) * 1000) / 1000,
      formula: "1+(모든 속성 적+수속성)/100",
    },
    {
      label: "지속성",
      base: earth,
      buff: buffBonus.earth || 0,
      equipment: 0,
      total: earth + (buffBonus.earth || 0),
      correction: Math.floor((1 + (allElement + earth + (buffBonus.earth || 0)) / 100) * 1000) / 1000,
      formula: "1+(모든 속성 적+지속성)/100",
    },
    {
      label: "화속성",
      base: fire,
      buff: buffBonus.fire || 0,
      equipment: 0,
      total: fire + (buffBonus.fire || 0),
      correction: Math.floor((1 + (allElement + fire + (buffBonus.fire || 0)) / 100) * 1000) / 1000,
      formula: "1+(모든 속성 적+화속성)/100",
    },
    {
      label: "풍속성",
      base: wind,
      buff: buffBonus.wind || 0,
      equipment: 0,
      total: wind + (buffBonus.wind || 0),
      correction: Math.floor((1 + (allElement + wind + (buffBonus.wind || 0)) / 100) * 1000) / 1000,
      formula: "1+(모든 속성 적+풍속성)/100",
    },
    {
      label: "독속성",
      base: poison,
      buff: 0,
      equipment: 0,
      total: poison,
      correction: Math.floor((1 + (allElement + poison) / 100) * 1000) / 1000,
      formula: "1+(모든 속성 적+독속성)/100",
    },
    {
      label: "성속성",
      base: holy,
      buff: 0,
      equipment: 0,
      total: holy,
      correction: Math.floor((1 + (allElement + holy) / 100) * 1000) / 1000,
      formula: "1+(모든 속성 적+성속성)/100",
    },
    {
      label: "암속성",
      base: shadow,
      buff: 0,
      equipment: 0,
      total: shadow,
      correction: Math.floor((1 + (allElement + shadow) / 100) * 1000) / 1000,
      formula: "1+(모든 속성 적+암속성)/100",
    },
    {
      label: "염속성",
      base: ghost,
      buff: 0,
      equipment: 0,
      total: ghost,
      correction: Math.floor((1 + (allElement + ghost) / 100) * 1000) / 1000,
      formula: "1+(모든 속성 적+염속성)/100",
    },
    {
      label: "불사속성",
      base: undead,
      buff: 0,
      equipment: 0,
      total: undead,
      correction: Math.floor((1 + (allElement + undead) / 100) * 1000) / 1000,
      formula: "1+(모든 속성 적+불사속성)/100",
    },
    {
      label: "모든 종족 몬스터",
      base: allRace,
      buff: 0,
      equipment: 0,
      total: allRace,
      correction: "",
      formula: "",
    },
    {
      label: "식물형",
      base: plant,
      buff: buffBonus.plant || 0,
      equipment: 0,
      total: plant + (buffBonus.plant || 0),
      correction: Math.floor((1 + (allRace + plant + (buffBonus.plant || 0)) / 100) * 1000) / 1000,
      formula: "1+(모든 종족 몬스터+식물형)/100",
    },
    {
      label: "불사형",
      base: undeadRace,
      buff: buffBonus.undeadRace || 0,
      equipment: 0,
      total: undeadRace + (buffBonus.undeadRace || 0),
      correction: Math.floor((1 + (allRace + undeadRace + (buffBonus.undeadRace || 0)) / 100) * 1000) / 1000,
      formula: "1+(모든 종족 몬스터+불사형)/100",
    },
    {
      label: "무형",
      base: formless,
      buff: buffBonus.formless || 0,
      equipment: 0,
      total: formless + (buffBonus.formless || 0),
      correction: Math.floor((1 + (allRace + formless + (buffBonus.formless || 0)) / 100) * 1000) / 1000,
      formula: "1+(모든 종족 몬스터+무형)/100",
    },
    {
      label: "천사형",
      base: angel,
      buff: buffBonus.angel || 0,
      equipment: 0,
      total: angel + (buffBonus.angel || 0),
      correction: Math.floor((1 + (allRace + angel + (buffBonus.angel || 0)) / 100) * 1000) / 1000,
      formula: "1+(모든 종족 몬스터+천사형)/100",
    },
    {
      label: "용족",
      base: dragon,
      buff: buffBonus.dragon || 0,
      equipment: 0,
      total: dragon + (buffBonus.dragon || 0),
      correction: Math.floor((1 + (allRace + dragon + (buffBonus.dragon || 0)) / 100) * 1000) / 1000,
      formula: "1+(모든 종족 몬스터+용족)/100",
    },
    {
      label: "어패형",
      base: fish,
      buff: buffBonus.fish || 0,
      equipment: 0,
      total: fish + (buffBonus.fish || 0),
      correction: Math.floor((1 + (allRace + fish + (buffBonus.fish || 0)) / 100) * 1000) / 1000,
      formula: "1+(모든 종족 몬스터+어패형)/100",
    },
    {
      label: "곤충형",
      base: insect,
      buff: buffBonus.insect || 0,
      equipment: 0,
      total: insect + (buffBonus.insect || 0),
      correction: Math.floor((1 + (allRace + insect + (buffBonus.insect || 0)) / 100) * 1000) / 1000,
      formula: "1+(모든 종족 몬스터+곤충형)/100",
    },
    {
      label: "동물형",
      base: brute,
      buff: buffBonus.brute || 0,
      equipment: 0,
      total: brute + (buffBonus.brute || 0),
      correction: Math.floor((1 + (allRace + brute + (buffBonus.brute || 0)) / 100) * 1000) / 1000,
      formula: "1+(모든 종족 몬스터+동물형)/100",
    },
    {
      label: "악마형",
      base: demon,
      buff: buffBonus.demon || 0,
      equipment: 0,
      total: demon + (buffBonus.demon || 0),
      correction: Math.floor((1 + (allRace + demon + (buffBonus.demon || 0)) / 100) * 1000) / 1000,
      formula: "1+(모든 종족 몬스터+악마형)/100",
    },
    {
      label: "인간형",
      base: demiHuman,
      buff: buffBonus.demiHuman || 0,
      equipment: 0,
      total: demiHuman + (buffBonus.demiHuman || 0),
      correction: Math.floor((1 + (allRace + demiHuman + (buffBonus.demiHuman || 0)) / 100) * 1000) / 1000,
      formula: "1+(모든 종족 몬스터+인간형)/100",
    },
    {
      label: "모든 속성 마법",
      base: allMagic,
      buff: buffBonus.allMagic || 0,
      equipment: 0,
      total: allMagic + (buffBonus.allMagic || 0),
      correction: Math.floor((1 + (allMagic + (buffBonus.allMagic || 0)) / 100) * 1000) / 1000,
      formula: "1+모든 속성 마법/100",
    },
    {
      label: "지속성 마법",
      base: variableMagic,
      buff: 0,
      equipment: 0,
      total: variableMagic,
      correction: Math.floor((1 + (allMagic + (buffBonus.allMagic || 0) + variableMagic) / 100) * 1000) / 1000,
      formula: "1+(모든 속성 마법+지속성 마법)/100",
    },
    {
      label: "풍속성 마법",
      base: windMagic,
      buff: 0,
      equipment: 0,
      total: windMagic,
      correction: Math.floor((1 + (allMagic + (buffBonus.allMagic || 0) + windMagic) / 100) * 1000) / 1000,
      formula: "1+(모든 속성 마법+풍속성 마법)/100",
    },
    {
      label: "수속성 마법",
      base: waterMagic,
      buff: 0,
      equipment: 0,
      total: waterMagic,
      correction: Math.floor((1 + (allMagic + (buffBonus.allMagic || 0) + waterMagic) / 100) * 1000) / 1000,
      formula: "1+(모든 속성 마법+수속성 마법)/100",
    },
    {
      label: "화속성 마법",
      base: fireMagic,
      buff: 0,
      equipment: 0,
      total: fireMagic,
      correction: Math.floor((1 + (allMagic + (buffBonus.allMagic || 0) + fireMagic) / 100) * 1000) / 1000,
      formula: "1+(모든 속성 마법+화속성 마법)/100",
    },
    {
      label: "염속성 마법",
      base: ghostMagic,
      buff: 0,
      equipment: 0,
      total: ghostMagic,
      correction: Math.floor((1 + (allMagic + (buffBonus.allMagic || 0) + ghostMagic) / 100) * 1000) / 1000,
      formula: "1+(모든 속성 마법+염속성 마법)/100",
    },
    {
      label: "암속성 마법",
      base: shadowMagic,
      buff: 0,
      equipment: 0,
      total: shadowMagic,
      correction: Math.floor((1 + (allMagic + (buffBonus.allMagic || 0) + shadowMagic) / 100) * 1000) / 1000,
      formula: "1+(모든 속성 마법+암속성 마법)/100",
    },
    {
      label: "성속성 마법",
      base: holyMagic,
      buff: 0,
      equipment: 0,
      total: holyMagic,
      correction: Math.floor((1 + (allMagic + (buffBonus.allMagic || 0) + holyMagic) / 100) * 1000) / 1000,
      formula: "1+(모든 속성 마법+성속성 마법)/100",
    },
    {
      label: "무속성 마법",
      base: neutralMagic,
      buff: 0,
      equipment: 0,
      total: neutralMagic,
      correction: Math.floor((1 + (allMagic + (buffBonus.allMagic || 0) + neutralMagic) / 100) * 1000) / 1000,
      formula: "1+(모든 속성 마법+무속성 마법)/100",
    },
    {
      label: "독속성 마법",
      base: poisonMagic,
      buff: 0,
      equipment: 0,
      total: poisonMagic,
      correction: Math.floor((1 + (allMagic + (buffBonus.allMagic || 0) + poisonMagic) / 100) * 1000) / 1000,
      formula: "1+(모든 속성 마법+독속성 마법)/100",
    },
    {
      label: "불사속성 마법",
      base: undeadMagic,
      buff: 0,
      equipment: 0,
      total: undeadMagic,
      correction: Math.floor((1 + (allMagic + (buffBonus.allMagic || 0) + undeadMagic) / 100) * 1000) / 1000,
      formula: "1+(모든 속성 마법+불사속성 마법)/100",
    },
    // 스킬 증뎀 항목
    {
      label: "청룡부",
      base: skillDamageBonus.chungyong,
      buff: 0,
      equipment: 0,
      total: skillDamageBonus.chungyong + 0 + 0,
      correction: Math.floor((skillDamageBonus.chungyong / 100 + 1) * 1000) / 1000,
      formula: "1+스킬 증뎀%/100",
    },
    {
      label: "백호부",
      base: skillDamageBonus.backho,
      buff: 0,
      equipment: 0,
      total: skillDamageBonus.backho + 0 + 0,
      correction: Math.floor((skillDamageBonus.backho / 100 + 1) * 1000) / 1000,
      formula: "1+스킬 증뎀%/100",
    },
    {
      label: "주작부",
      base: skillDamageBonus.jujak,
      buff: 0,
      equipment: 0,
      total: skillDamageBonus.jujak + 0 + 0,
      correction: Math.floor((skillDamageBonus.jujak / 100 + 1) * 1000) / 1000,
      formula: "1+스킬 증뎀%/100",
    },
    {
      label: "현무부",
      base: skillDamageBonus.hyunmu,
      buff: 0,
      equipment: 0,
      total: skillDamageBonus.hyunmu + 0 + 0,
      correction: Math.floor((skillDamageBonus.hyunmu / 100 + 1) * 1000) / 1000,
      formula: "1+스킬 증뎀%/100",
    },
    {
      label: "사방신부",
      base: skillDamageBonus.sabangsin,
      buff: 0,
      equipment: 0,
      total: skillDamageBonus.sabangsin + 0 + 0,
      correction: Math.floor((skillDamageBonus.sabangsin / 100 + 1) * 1000) / 1000,
      formula: "1+스킬 증뎀%/100",
    },
    {
      label: "사방오행진",
      base: skillDamageBonus.sabangohaeng,
      buff: 0,
      equipment: 0,
      total: skillDamageBonus.sabangohaeng + 0 + 0,
      correction: Math.floor((skillDamageBonus.sabangohaeng / 100 + 1) * 1000) / 1000,
      formula: "1+스킬 증뎀%/100",
    },
  ];

  // 최종 데미지 계산 및 콜백 전달
  React.useEffect(() => {
    if (onDamageCalculated) {
      const calculateSkillDamage = (skillId: string): SkillDamageResult => {
        const skillMatk = getSkillMatk(skillId);
        const levelCoeff = baseLevel / 100;
        
        let splCoeff = 0;
        if (skillId === 'chungyong') splCoeff = 3;
        else if (skillId === 'backho') splCoeff = 1.5;
        else if (skillId === 'jujak') splCoeff = 2;
        else if (skillId === 'hyunmu') splCoeff = 1.5;
        else if (skillId === 'sabangsin') splCoeff = 6;
        else if (skillId === 'sabangohaeng') splCoeff = 3;
        
        const skillFinal = (skillMatk + (splCoeff * totalSPL)) * levelCoeff;
        const basicSkillMin = Math.floor(skillFinal * (finalMatkMinResult * 0.01));
        const basicSkillMax = Math.floor(skillFinal * (finalMatkMaxResult * 0.01));
        
        let skillDamageCorrection = 1.000;
        if (skillId === 'chungyong') {
          skillDamageCorrection = Math.floor((skillDamageBonus.chungyong / 100 + 1) * 1000) / 1000;
        } else if (skillId === 'backho') {
          skillDamageCorrection = Math.floor((skillDamageBonus.backho / 100 + 1) * 1000) / 1000;
        } else if (skillId === 'jujak') {
          skillDamageCorrection = Math.floor((skillDamageBonus.jujak / 100 + 1) * 1000) / 1000;
        } else if (skillId === 'hyunmu') {
          skillDamageCorrection = Math.floor((skillDamageBonus.hyunmu / 100 + 1) * 1000) / 1000;
        } else if (skillId === 'sabangsin') {
          skillDamageCorrection = Math.floor((skillDamageBonus.sabangsin / 100 + 1) * 1000) / 1000;
        } else if (skillId === 'sabangohaeng') {
          skillDamageCorrection = Math.floor((skillDamageBonus.sabangohaeng / 100 + 1) * 1000) / 1000;
        }
        
        const skillDamageMin = Math.floor(skillDamageCorrection * basicSkillMin);
        const skillDamageMax = Math.floor(skillDamageCorrection * basicSkillMax);
        const elementModifier = calculateElementModifier(warmWind, monsterElement) / 100;
        const elementLevelMin = Math.floor(skillDamageMin * elementModifier);
        const elementLevelMax = Math.floor(skillDamageMax * elementModifier);
        
        const resistanceModifier = (2000 + monsterMres) / (2000 + monsterMres * 5);
        const resistanceAppliedMin = Math.floor(elementLevelMin * resistanceModifier);
        const resistanceAppliedMax = Math.floor(elementLevelMax * resistanceModifier);
        
        const finalDamageMin = Math.floor(resistanceAppliedMin * (monsterRatio / 100));
        const finalDamageMax = Math.floor(resistanceAppliedMax * (monsterRatio / 100));
        const finalDamageAvg = Math.floor((finalDamageMin + finalDamageMax) / 2);
        
        return {
          min: finalDamageMin,
          max: finalDamageMax,
          avg: finalDamageAvg
        };
      };

      const damages: SkillDamages = {
        chungyong: calculateSkillDamage('chungyong'),
        backho: calculateSkillDamage('backho'),
        jujak: calculateSkillDamage('jujak'),
        hyunmu: calculateSkillDamage('hyunmu'),
        sabangsin: calculateSkillDamage('sabangsin'),
        sabangohaeng: calculateSkillDamage('sabangohaeng'),
      };

      onDamageCalculated(damages);
    }
  }, [
    baseLevel, totalSPL, finalMatkMinResult, finalMatkMaxResult, 
    skillDamageBonus, warmWind, monsterElement, monsterMres, monsterRatio,
    activeSkillFormulas, skillLevels, onDamageCalculated
  ]);

  return (
    <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-white">데미지 계산식</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="magic" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="magic">마법 데미지</TabsTrigger>
            <TabsTrigger value="ranged">데미지 계산노트</TabsTrigger>
          </TabsList>

          <TabsContent value="magic">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-purple-300">항목</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-purple-300">기본</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-purple-300">버프</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-purple-300">장비</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-purple-300">합계</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-purple-300">보정</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-purple-300">공식설명</th>
                  </tr>
                </thead>
                <tbody>
                  {calculations.map((row, index) => {
                    // BASE LEVEL부터 FINAL MATK MAX까지는 회색 배경 (인덱스 0~19)
                    const isTopSection = index <= 19;
                    const bgColor = isTopSection
                      ? (index % 2 === 0 ? "bg-slate-600/40" : "bg-slate-600/30")
                      : (index % 2 === 0 ? "bg-slate-700/20" : "bg-slate-700/10");
                    
                    // MATK % (인덱스 20)부터 마지막까지는 소수점 3자리 표시
                    const shouldShowDecimal = index >= 20;
                    const correctionDisplay = shouldShowDecimal && typeof row.correction === 'number'
                      ? row.correction.toFixed(3)
                      : row.correction;
                    
                    // EQUIP MATK(인덱스 6)부터 FINAL MATK MAX(인덱스 19)까지는 버프/장비/합계/보정값 숨김
                    const hideColumns = index >= 6 && index <= 19;
                    
                    return (
                      <tr
                        key={row.label}
                        className={`border-b border-slate-700/50 ${bgColor}`}
                      >
                        <td className="px-4 py-3 text-sm font-medium text-white">{row.label}</td>
                        <td className="px-4 py-3 text-center text-sm text-white">{row.base}</td>
                        <td className="px-4 py-3 text-center text-sm text-white">{hideColumns ? "" : row.buff}</td>
                        <td className="px-4 py-3 text-center text-sm text-white">{hideColumns ? "" : row.equipment}</td>
                        <td className="px-4 py-3 text-center text-sm font-semibold text-cyan-400">
                          {hideColumns ? "" : row.total}
                        </td>
                        <td className="px-4 py-3 text-center text-sm font-bold text-green-400">
                          {hideColumns ? "" : correctionDisplay}
                        </td>
                        <td className="px-4 py-3 text-sm text-purple-300">{row.formula}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="ranged">
            <div className="space-y-6">
              {/* 사방신 스킬 테이블 */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-600">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-purple-300">항목</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-purple-300">청룡부</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-purple-300">백호부</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-purple-300">주작부</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-purple-300">현무부</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-purple-300">사방신부</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-purple-300">사방오행진</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* 스킬레벨 행 */}
                    <tr className="border-b border-slate-700/50 bg-slate-700/20">
                      <td className="px-4 py-3 text-sm font-medium text-white">스킬레벨</td>
                      {sabangsinSkills.map(skill => (
                        <td key={skill.id} className="px-4 py-3 text-center text-sm text-white">
                          {skillLevels[skill.id] || 0}
                        </td>
                      ))}
                    </tr>
                    
                    {/* 스킬증뎀 행 */}
                    <tr className="border-b border-slate-700/50 bg-slate-700/10">
                      <td className="px-4 py-3 text-sm font-medium text-white">스킬증뎀</td>
                      <td className="px-4 py-3 text-center text-sm text-white">
                        {(Math.floor((skillDamageBonus.chungyong / 100 + 1) * 1000) / 1000).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-white">
                        {(Math.floor((skillDamageBonus.backho / 100 + 1) * 1000) / 1000).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-white">
                        {(Math.floor((skillDamageBonus.jujak / 100 + 1) * 1000) / 1000).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-white">
                        {(Math.floor((skillDamageBonus.hyunmu / 100 + 1) * 1000) / 1000).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-white">
                        {(Math.floor((skillDamageBonus.sabangsin / 100 + 1) * 1000) / 1000).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-white">
                        {(Math.floor((skillDamageBonus.sabangohaeng / 100 + 1) * 1000) / 1000).toFixed(2)}
                      </td>
                    </tr>
                    
                    {/* SPL 계수 행 */}
                    <tr className="border-b border-slate-700/50 bg-slate-700/20">
                      <td className="px-4 py-3 text-sm font-medium text-white">SPL 계수</td>
                      {sabangsinSkills.map(skill => (
                        <td key={skill.id} className="px-4 py-3 text-center text-sm text-white">
                          {skill.splCoeff}
                        </td>
                      ))}
                    </tr>
                    
                    {/* SPL 총합 행 */}
                    <tr className="border-b border-slate-700/50 bg-slate-700/10">
                      <td className="px-4 py-3 text-sm font-medium text-white">SPL 총합</td>
                      {sabangsinSkills.map(skill => (
                        <td key={skill.id} className="px-4 py-3 text-center text-sm text-white">
                          {totalSPL}
                        </td>
                      ))}
                    </tr>
                    
                    {/* LEVEL 계수 행 */}
                    <tr className="border-b border-slate-700/50 bg-slate-700/20">
                      <td className="px-4 py-3 text-sm font-medium text-white">LEVEL 계수</td>
                      {sabangsinSkills.map(skill => (
                        <td key={skill.id} className="px-4 py-3 text-center text-sm text-white">
                          {(baseLevel / 100).toFixed(4)}
                        </td>
                      ))}
                    </tr>
                    
                    {/* 스킬% 행 */}
                    <tr className="border-b border-slate-700/50 bg-slate-700/10">
                      <td className="px-4 py-3 text-sm font-medium text-white">스킬%</td>
                      {sabangsinSkills.map(skill => (
                        <td key={skill.id} className="px-4 py-3 text-center text-sm text-white">
                          {getSkillMatk(skill.id).toLocaleString()}
                        </td>
                      ))}
                    </tr>
                    
                    {/* 스킬최종 행 */}
                    <tr className="border-b border-slate-700/50 bg-slate-700/20">
                      <td className="px-4 py-3 text-sm font-medium text-white">스킬최종</td>
                      {sabangsinSkills.map(skill => {
                        const skillMatk = getSkillMatk(skill.id);
                        const levelCoeff = baseLevel / 100;
                        const splCoeff = skill.splCoeff;
                        const skillFinal = (skillMatk + (splCoeff * totalSPL)) * levelCoeff;
                        return (
                          <td key={skill.id} className="px-4 py-3 text-center text-sm font-bold text-green-400">
                            {Math.floor(skillFinal)}
                          </td>
                        );
                      })}
                    </tr>
                    
                    {/* 사이즈증뎀 행 */}
                    <tr className="border-b border-slate-700/50 bg-slate-700/10">
                      <td className="px-4 py-3 text-sm font-medium text-white">사이즈증뎀</td>
                      {sabangsinSkills.map(skill => (
                        <td key={skill.id} className="px-4 py-3 text-center text-sm font-bold text-cyan-400">
                          {sizeCorrection.toFixed(3)}
                        </td>
                      ))}
                    </tr>
                    
                    {/* 속성적증뎀 행 */}
                    <tr className="border-b border-slate-700/50 bg-slate-700/20">
                      <td className="px-4 py-3 text-sm font-medium text-white">속성적증뎀</td>
                      {sabangsinSkills.map(skill => (
                        <td key={skill.id} className="px-4 py-3 text-center text-sm font-bold text-cyan-400">
                          {elementCorrection.toFixed(3)}
                        </td>
                      ))}
                    </tr>
                    
                    {/* 속성증뎀 행 */}
                    <tr className="border-b border-slate-700/50 bg-slate-700/10">
                      <td className="px-4 py-3 text-sm font-medium text-white">속성증뎀</td>
                      {sabangsinSkills.map(skill => (
                        <td key={skill.id} className="px-4 py-3 text-center text-sm font-bold text-cyan-400">
                          {magicElementCorrection.toFixed(3)}
                        </td>
                      ))}
                    </tr>
                    
                    {/* 종족증뎀 행 */}
                    <tr className="border-b border-slate-700/50 bg-slate-700/20">
                      <td className="px-4 py-3 text-sm font-medium text-white">종족증뎀</td>
                      {sabangsinSkills.map(skill => (
                        <td key={skill.id} className="px-4 py-3 text-center text-sm font-bold text-cyan-400">
                          {raceCorrection.toFixed(3)}
                        </td>
                      ))}
                    </tr>
                    
                    {/* 등급증뎀 행 */}
                    <tr className="border-b border-slate-700/50 bg-slate-700/10">
                      <td className="px-4 py-3 text-sm font-medium text-white">등급증뎀</td>
                      {sabangsinSkills.map(skill => (
                        <td key={skill.id} className="px-4 py-3 text-center text-sm font-bold text-cyan-400">
                          {gradeCorrection.toFixed(3)}
                        </td>
                      ))}
                    </tr>
                    
                    {/* FINAL MATK(MIN) 행 */}
                    <tr className="border-b border-slate-700/50 bg-slate-700/20">
                      <td className="px-4 py-3 text-sm font-medium text-white">FINAL MATK(MIN)</td>
                      {sabangsinSkills.map(skill => (
                        <td key={skill.id} className="px-4 py-3 text-center text-sm font-bold text-yellow-400">
                          {finalMatkMinResult.toLocaleString()}
                        </td>
                      ))}
                    </tr>
                    
                    {/* FINAL MATK(MAX) 행 */}
                    <tr className="border-b border-slate-700/50 bg-slate-700/10">
                      <td className="px-4 py-3 text-sm font-medium text-white">FINAL MATK(MAX)</td>
                      {sabangsinSkills.map(skill => (
                        <td key={skill.id} className="px-4 py-3 text-center text-sm font-bold text-yellow-400">
                          {finalMatkMaxResult.toLocaleString()}
                        </td>
                      ))}
                    </tr>
                    
                    {/* 기본스킬 MIN 행 */}
                    <tr className="border-b border-slate-700/50 bg-slate-700/20">
                      <td className="px-4 py-3 text-sm font-medium text-white">기본스킬 MIN</td>
                      {sabangsinSkills.map(skill => {
                        const skillMatk = getSkillMatk(skill.id);
                        const levelCoeff = baseLevel / 100;
                        const splCoeff = skill.splCoeff;
                        const skillFinal = (skillMatk + (splCoeff * totalSPL)) * levelCoeff;
                        const basicSkillMin = Math.floor(skillFinal * (finalMatkMinResult * 0.01));
                        return (
                          <td key={skill.id} className="px-4 py-3 text-center text-sm font-bold text-orange-400">
                            {basicSkillMin.toLocaleString()}
                          </td>
                        );
                      })}
                    </tr>
                    
                    {/* 기본스킬 MAX 행 */}
                    <tr className="border-b border-slate-700/50 bg-slate-700/10">
                      <td className="px-4 py-3 text-sm font-medium text-white">기본스킬 MAX</td>
                      {sabangsinSkills.map(skill => {
                        const skillMatk = getSkillMatk(skill.id);
                        const levelCoeff = baseLevel / 100;
                        const splCoeff = skill.splCoeff;
                        const skillFinal = (skillMatk + (splCoeff * totalSPL)) * levelCoeff;
                        const basicSkillMax = Math.floor(skillFinal * (finalMatkMaxResult * 0.01));
                        return (
                          <td key={skill.id} className="px-4 py-3 text-center text-sm font-bold text-orange-400">
                            {basicSkillMax.toLocaleString()}
                          </td>
                        );
                      })}
                    </tr>
                    
                    {/* 스킬증뎀 MIN 행 */}
                    <tr className="border-b border-slate-700/50 bg-slate-700/20">
                      <td className="px-4 py-3 text-sm font-medium text-white">스킬증뎀 MIN</td>
                      {sabangsinSkills.map(skill => {
                        const skillMatk = getSkillMatk(skill.id);
                        const levelCoeff = baseLevel / 100;
                        const splCoeff = skill.splCoeff;
                        const skillFinal = (skillMatk + (splCoeff * totalSPL)) * levelCoeff;
                        const basicSkillMin = Math.floor(skillFinal * (finalMatkMinResult * 0.01));
                        
                        // 스킬증뎀 보정값 가져오기
                        let skillDamageCorrection = 1.000;
                        if (skill.id === 'chungyong') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.chungyong / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'backho') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.backho / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'jujak') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.jujak / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'hyunmu') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.hyunmu / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'sabangsin') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.sabangsin / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'sabangohaeng') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.sabangohaeng / 100 + 1) * 1000) / 1000;
                        }
                        
                        const skillDamageMin = Math.floor(skillDamageCorrection * basicSkillMin);
                        return (
                          <td key={skill.id} className="px-4 py-3 text-center text-sm font-bold text-pink-400">
                            {skillDamageMin.toLocaleString()}
                          </td>
                        );
                      })}
                    </tr>
                    
                    {/* 스킬증뎀 MAX 행 */}
                    <tr className="border-b border-slate-700/50 bg-slate-700/10">
                      <td className="px-4 py-3 text-sm font-medium text-white">스킬증뎀 MAX</td>
                      {sabangsinSkills.map(skill => {
                        const skillMatk = getSkillMatk(skill.id);
                        const levelCoeff = baseLevel / 100;
                        const splCoeff = skill.splCoeff;
                        const skillFinal = (skillMatk + (splCoeff * totalSPL)) * levelCoeff;
                        const basicSkillMax = Math.floor(skillFinal * (finalMatkMaxResult * 0.01));
                        
                        // 스킬증뎀 보정값 가져오기
                        let skillDamageCorrection = 1.000;
                        if (skill.id === 'chungyong') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.chungyong / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'backho') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.backho / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'jujak') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.jujak / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'hyunmu') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.hyunmu / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'sabangsin') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.sabangsin / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'sabangohaeng') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.sabangohaeng / 100 + 1) * 1000) / 1000;
                        }
                        
                        const skillDamageMax = Math.floor(skillDamageCorrection * basicSkillMax);
                        return (
                          <td key={skill.id} className="px-4 py-3 text-center text-sm font-bold text-pink-400">
                            {skillDamageMax.toLocaleString()}
                          </td>
                        );
                      })}
                    </tr>
                    
                    {/* 속성레벨증감 행 */}
                    <tr className="border-b border-slate-700/50 bg-slate-700/20">
                      <td className="px-4 py-3 text-sm font-medium text-white">속성레벨증감</td>
                      {sabangsinSkills.map(skill => {
                        const elementModifier = calculateElementModifier(warmWind, monsterElement);
                        return (
                          <td key={skill.id} className={`px-4 py-3 text-center text-sm font-bold ${
                            elementModifier === 0 
                              ? 'text-red-500' 
                              : elementModifier >= 125
                              ? 'text-green-400'
                              : elementModifier < 100
                              ? 'text-orange-400'
                              : 'text-white'
                          }`}>
                            {(elementModifier / 100).toFixed(3)}
                          </td>
                        );
                      })}
                    </tr>
                    
                    {/* 속성레벨증감(MIN) 행 */}
                    <tr className="border-b border-slate-700/50 bg-slate-700/10">
                      <td className="px-4 py-3 text-sm font-medium text-white">속성레벨증감(MIN)</td>
                      {sabangsinSkills.map(skill => {
                        const skillMatk = getSkillMatk(skill.id);
                        const levelCoeff = baseLevel / 100;
                        const splCoeff = skill.splCoeff;
                        const skillFinal = (skillMatk + (splCoeff * totalSPL)) * levelCoeff;
                        const basicSkillMin = Math.floor(skillFinal * (finalMatkMinResult * 0.01));
                        
                        let skillDamageCorrection = 1.000;
                        if (skill.id === 'chungyong') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.chungyong / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'backho') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.backho / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'jujak') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.jujak / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'hyunmu') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.hyunmu / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'sabangsin') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.sabangsin / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'sabangohaeng') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.sabangohaeng / 100 + 1) * 1000) / 1000;
                        }
                        
                        const skillDamageMin = Math.floor(skillDamageCorrection * basicSkillMin);
                        const elementModifier = calculateElementModifier(warmWind, monsterElement) / 100;
                        const elementLevelMin = Math.floor(skillDamageMin * elementModifier);
                        
                        return (
                          <td key={skill.id} className="px-4 py-3 text-center text-sm font-bold text-purple-400">
                            {elementLevelMin.toLocaleString()}
                          </td>
                        );
                      })}
                    </tr>
                    
                    {/* 속성레벨증감(MAX) 행 */}
                    <tr className="border-b border-slate-700/50 bg-slate-700/20">
                      <td className="px-4 py-3 text-sm font-medium text-white">속성레벨증감(MAX)</td>
                      {sabangsinSkills.map(skill => {
                        const skillMatk = getSkillMatk(skill.id);
                        const levelCoeff = baseLevel / 100;
                        const splCoeff = skill.splCoeff;
                        const skillFinal = (skillMatk + (splCoeff * totalSPL)) * levelCoeff;
                        const basicSkillMax = Math.floor(skillFinal * (finalMatkMaxResult * 0.01));
                        
                        let skillDamageCorrection = 1.000;
                        if (skill.id === 'chungyong') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.chungyong / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'backho') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.backho / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'jujak') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.jujak / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'hyunmu') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.hyunmu / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'sabangsin') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.sabangsin / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'sabangohaeng') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.sabangohaeng / 100 + 1) * 1000) / 1000;
                        }
                        
                        const skillDamageMax = Math.floor(skillDamageCorrection * basicSkillMax);
                        const elementModifier = calculateElementModifier(warmWind, monsterElement) / 100;
                        const elementLevelMax = Math.floor(skillDamageMax * elementModifier);
                        
                        return (
                          <td key={skill.id} className="px-4 py-3 text-center text-sm font-bold text-purple-400">
                            {elementLevelMax.toLocaleString()}
                          </td>
                        );
                      })}
                    </tr>
                    
                    {/* MRES 행 */}
                    <tr className="border-b border-slate-700/50 bg-slate-700/10">
                      <td className="px-4 py-3 text-sm font-medium text-white">MRES</td>
                      {sabangsinSkills.map(skill => (
                        <td key={skill.id} className="px-4 py-3 text-center text-sm font-bold text-cyan-400">
                          {monsterMres}
                        </td>
                      ))}
                    </tr>
                    
                    {/* 저항수치적용(MIN) 행 */}
                    <tr className="border-b border-slate-700/50 bg-slate-700/20">
                      <td className="px-4 py-3 text-sm font-medium text-white">저항수치적용(MIN)</td>
                      {sabangsinSkills.map(skill => {
                        const skillMatk = getSkillMatk(skill.id);
                        const levelCoeff = baseLevel / 100;
                        const splCoeff = skill.splCoeff;
                        const skillFinal = (skillMatk + (splCoeff * totalSPL)) * levelCoeff;
                        const basicSkillMin = Math.floor(skillFinal * (finalMatkMinResult * 0.01));
                        
                        let skillDamageCorrection = 1.000;
                        if (skill.id === 'chungyong') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.chungyong / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'backho') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.backho / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'jujak') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.jujak / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'hyunmu') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.hyunmu / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'sabangsin') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.sabangsin / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'sabangohaeng') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.sabangohaeng / 100 + 1) * 1000) / 1000;
                        }
                        
                        const skillDamageMin = Math.floor(skillDamageCorrection * basicSkillMin);
                        const elementModifier = calculateElementModifier(warmWind, monsterElement) / 100;
                        const elementLevelMin = Math.floor(skillDamageMin * elementModifier);
                        
                        // 저항 수치 적용 공식: elementLevelMin * ((2000 + MRES) / (2000 + MRES * 5))
                        const resistanceModifier = (2000 + monsterMres) / (2000 + monsterMres * 5);
                        const resistanceAppliedMin = Math.floor(elementLevelMin * resistanceModifier);
                        
                        return (
                          <td key={skill.id} className="px-4 py-3 text-center text-sm font-bold text-yellow-300">
                            {resistanceAppliedMin.toLocaleString()}
                          </td>
                        );
                      })}
                    </tr>
                    
                    {/* 저항수치적용(MAX) 행 */}
                    <tr className="border-b border-slate-700/50 bg-slate-700/10">
                      <td className="px-4 py-3 text-sm font-medium text-white">저항수치적용(MAX)</td>
                      {sabangsinSkills.map(skill => {
                        const skillMatk = getSkillMatk(skill.id);
                        const levelCoeff = baseLevel / 100;
                        const splCoeff = skill.splCoeff;
                        const skillFinal = (skillMatk + (splCoeff * totalSPL)) * levelCoeff;
                        const basicSkillMax = Math.floor(skillFinal * (finalMatkMaxResult * 0.01));
                        
                        let skillDamageCorrection = 1.000;
                        if (skill.id === 'chungyong') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.chungyong / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'backho') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.backho / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'jujak') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.jujak / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'hyunmu') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.hyunmu / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'sabangsin') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.sabangsin / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'sabangohaeng') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.sabangohaeng / 100 + 1) * 1000) / 1000;
                        }
                        
                        const skillDamageMax = Math.floor(skillDamageCorrection * basicSkillMax);
                        const elementModifier = calculateElementModifier(warmWind, monsterElement) / 100;
                        const elementLevelMax = Math.floor(skillDamageMax * elementModifier);
                        
                        // 저항 수치 적용 공식: elementLevelMax * ((2000 + MRES) / (2000 + MRES * 5))
                        const resistanceModifier = (2000 + monsterMres) / (2000 + monsterMres * 5);
                        const resistanceAppliedMax = Math.floor(elementLevelMax * resistanceModifier);
                        
                        return (
                          <td key={skill.id} className="px-4 py-3 text-center text-sm font-bold text-yellow-300">
                            {resistanceAppliedMax.toLocaleString()}
                          </td>
                        );
                      })}
                    </tr>
                    
                    {/* 데미지비율(%) 행 */}
                    <tr className="border-b border-slate-700/50 bg-slate-700/10">
                      <td className="px-4 py-3 text-sm font-medium text-white">데미지비율(%)</td>
                      {sabangsinSkills.map(skill => (
                        <td key={skill.id} className="px-4 py-3 text-center text-sm font-bold text-cyan-400">
                          {monsterRatio}%
                        </td>
                      ))}
                    </tr>
                    
                    {/* 최종데미지(MIN) 행 */}
                    <tr className="border-b border-slate-700/50 bg-slate-700/20">
                      <td className="px-4 py-3 text-sm font-medium text-white">최종데미지(MIN)</td>
                      {sabangsinSkills.map(skill => {
                        const skillMatk = getSkillMatk(skill.id);
                        const levelCoeff = baseLevel / 100;
                        const splCoeff = skill.splCoeff;
                        const skillFinal = (skillMatk + (splCoeff * totalSPL)) * levelCoeff;
                        const basicSkillMin = Math.floor(skillFinal * (finalMatkMinResult * 0.01));
                        
                        let skillDamageCorrection = 1.000;
                        if (skill.id === 'chungyong') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.chungyong / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'backho') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.backho / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'jujak') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.jujak / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'hyunmu') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.hyunmu / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'sabangsin') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.sabangsin / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'sabangohaeng') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.sabangohaeng / 100 + 1) * 1000) / 1000;
                        }
                        
                        const skillDamageMin = Math.floor(skillDamageCorrection * basicSkillMin);
                        const elementModifier = calculateElementModifier(warmWind, monsterElement) / 100;
                        const elementLevelMin = Math.floor(skillDamageMin * elementModifier);
                        
                        // 저항 수치 적용 공식: elementLevelMin * ((2000 + MRES) / (2000 + MRES * 5))
                        const resistanceModifier = (2000 + monsterMres) / (2000 + monsterMres * 5);
                        const resistanceAppliedMin = Math.floor(elementLevelMin * resistanceModifier);
                        
                        // 데미지비율 적용
                        const finalDamageMin = Math.floor(resistanceAppliedMin * (monsterRatio / 100));
                        
                        return (
                          <td key={skill.id} className="px-4 py-3 text-center text-sm font-bold text-green-400">
                            {finalDamageMin.toLocaleString()}
                          </td>
                        );
                      })}
                    </tr>
                    
                    {/* 최종데미지(MAX) 행 */}
                    <tr className="border-b border-slate-700/50 bg-slate-700/10">
                      <td className="px-4 py-3 text-sm font-medium text-white">최종데미지(MAX)</td>
                      {sabangsinSkills.map(skill => {
                        const skillMatk = getSkillMatk(skill.id);
                        const levelCoeff = baseLevel / 100;
                        const splCoeff = skill.splCoeff;
                        const skillFinal = (skillMatk + (splCoeff * totalSPL)) * levelCoeff;
                        const basicSkillMax = Math.floor(skillFinal * (finalMatkMaxResult * 0.01));
                        
                        let skillDamageCorrection = 1.000;
                        if (skill.id === 'chungyong') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.chungyong / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'backho') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.backho / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'jujak') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.jujak / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'hyunmu') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.hyunmu / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'sabangsin') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.sabangsin / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'sabangohaeng') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.sabangohaeng / 100 + 1) * 1000) / 1000;
                        }
                        
                        const skillDamageMax = Math.floor(skillDamageCorrection * basicSkillMax);
                        const elementModifier = calculateElementModifier(warmWind, monsterElement) / 100;
                        const elementLevelMax = Math.floor(skillDamageMax * elementModifier);
                        
                        // 저항 수치 적용 공식: elementLevelMax * ((2000 + MRES) / (2000 + MRES * 5))
                        const resistanceModifier = (2000 + monsterMres) / (2000 + monsterMres * 5);
                        const resistanceAppliedMax = Math.floor(elementLevelMax * resistanceModifier);
                        
                        // 데미지비율 적용
                        const finalDamageMax = Math.floor(resistanceAppliedMax * (monsterRatio / 100));
                        
                        return (
                          <td key={skill.id} className="px-4 py-3 text-center text-sm font-bold text-green-400">
                            {finalDamageMax.toLocaleString()}
                          </td>
                        );
                      })}
                    </tr>
                    
                    {/* 최종데미지(평균) 행 */}
                    <tr className="border-b border-slate-700/50 bg-slate-700/20">
                      <td className="px-4 py-3 text-sm font-medium text-white">최종데미지(평균)</td>
                      {sabangsinSkills.map(skill => {
                        const skillMatk = getSkillMatk(skill.id);
                        const levelCoeff = baseLevel / 100;
                        const splCoeff = skill.splCoeff;
                        const skillFinal = (skillMatk + (splCoeff * totalSPL)) * levelCoeff;
                        const basicSkillMin = Math.floor(skillFinal * (finalMatkMinResult * 0.01));
                        const basicSkillMax = Math.floor(skillFinal * (finalMatkMaxResult * 0.01));
                        
                        let skillDamageCorrection = 1.000;
                        if (skill.id === 'chungyong') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.chungyong / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'backho') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.backho / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'jujak') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.jujak / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'hyunmu') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.hyunmu / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'sabangsin') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.sabangsin / 100 + 1) * 1000) / 1000;
                        } else if (skill.id === 'sabangohaeng') {
                          skillDamageCorrection = Math.floor((skillDamageBonus.sabangohaeng / 100 + 1) * 1000) / 1000;
                        }
                        
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
                        
                        return (
                          <td key={skill.id} className="px-4 py-3 text-center text-sm font-bold text-yellow-400">
                            {finalDamageAvg.toLocaleString()}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}