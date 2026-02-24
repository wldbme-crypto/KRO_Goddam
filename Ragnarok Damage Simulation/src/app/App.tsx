import { useState, useEffect } from "react";
import { RotateCcw, Save, Upload, Trash } from "lucide-react";
import { ClassSelector, getClassType } from "./components/ClassSelector";
import { LevelInput } from "./components/LevelInput";
import { StatDistribution } from "./components/StatDistribution";
import { TraitStatDistribution } from "./components/TraitStatDistribution";
import { DamageCalculation, SkillDamages } from "./components/DamageCalculation";
import { WeaponSettings } from "./components/WeaponSettings";
import { SkillTree, ActiveSkillFormula } from "./components/SkillTree";
import { BuffSettings } from "./components/BuffSettings";
import { MonsterInfo } from "./components/MonsterInfo";
import { MonsterNameInput } from "./components/MonsterNameInput";
import { ElementTable } from "./components/ElementTable";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Label } from "./components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { calculateStatPoints, calculateSkillPoints, calculateTraitStatPoints } from "./utils/pointCalculator";
import { calculateTotalBuffBonus } from "./utils/buffCalculator";
import { calculateSkillDamage } from "./utils/damageCalculator";

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

export default function App() {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [baseLevel, setBaseLevel] = useState<number>(1);
  const [jobLevel, setJobLevel] = useState<number>(1);
  const [stats, setStats] = useState<Stats>({
    STR: 1,
    AGI: 1,
    VIT: 1,
    INT: 1,
    DEX: 1,
    LUK: 1,
  });
  const [statBonus, setStatBonus] = useState<StatBonus>({
    STR: 0,
    AGI: 0,
    VIT: 0,
    INT: 0,
    DEX: 0,
    LUK: 0,
  });
  const [traitStats, setTraitStats] = useState<TraitStats>({
    POW: 0,
    STA: 0,
    WIS: 0,
    SPL: 0,
    CON: 0,
    CRT: 0,
  });
  const [traitStatBonus, setTraitStatBonus] = useState<TraitStatBonus>({
    POW: 0,
    STA: 0,
    WIS: 0,
    SPL: 0,
    CON: 0,
    CRT: 0,
  });

  // 무기 설정 상태
  const [weaponGrade, setWeaponGrade] = useState<"A등급" | "B등급" | "C등급" | "D등급" | "무등급">("무등급");
  const [weaponRefine, setWeaponRefine] = useState<number>(0);
  const [baseWeaponDamage, setBaseWeaponDamage] = useState<number>(0);

  // 장비 설정 상태
  const [equipmentStats, setEquipmentStats] = useState({
    matkMin: 0,
    matkMax: 0,
    statMatk: 0,
    equipMatk: 0,
    matkPercent: 0,
    smatk: 0,
    general: 0,
    boss: 0,
    small: 0,
    medium: 0,
    large: 0,
    allSize: 0,
    neutral: 0,
    water: 0,
    earth: 0,
    fire: 0,
    wind: 0,
    poison: 0,
    holy: 0,
    shadow: 0,
    ghost: 0,
    undead: 0,
    allElement: 0,
    plant: 0,
    undeadRace: 0,
    formless: 0,
    angel: 0,
    dragon: 0,
    fish: 0,
    insect: 0,
    brute: 0,
    demon: 0,
    demiHuman: 0,
    allRace: 0,
    variableMagic: 0,
    windMagic: 0,
    waterMagic: 0,
    fireMagic: 0,
    ghostMagic: 0,
    shadowMagic: 0,
    holyMagic: 0,
    neutralMagic: 0,
    poisonMagic: 0,
    undeadMagic: 0,
    allMagic: 0,
  });

  // 스킬 증뎀 상태
  const [skillDamageBonus, setSkillDamageBonus] = useState({
    chungyong: 0,  // 청룡부
    backho: 0,     // 백호부
    jujak: 0,      // 주작부
    hyunmu: 0,     // 현무부
    sabangsin: 0,  // ��방신부
    sabangohaeng: 0, // 사방오행진
    saryoung: 0,   // 사령���화
  });

  // 스킬 레벨 상태
  const [skillLevels, setSkillLevels] = useState<Record<string, number>>({});
  
  // 활성화된 스킬 공식 상태
  const [activeSkillFormulas, setActiveSkillFormulas] = useState<ActiveSkillFormula[]>([]);

  // 최종 스킬 데미지 상태 (C-1에서 계산된 값)
  const [skillDamages, setSkillDamages] = useState<SkillDamages>({
    chungyong: { min: 0, max: 0, avg: 0 },
    backho: { min: 0, max: 0, avg: 0 },
    jujak: { min: 0, max: 0, avg: 0 },
    hyunmu: { min: 0, max: 0, avg: 0 },
    sabangsin: { min: 0, max: 0, avg: 0 },
    sabangohaeng: { min: 0, max: 0, avg: 0 },
  });

  // 버프 설정 상태
  const [selectedBuffs, setSelectedBuffs] = useState<{
    skills: string[];
    lunaforma: string[];
    cashItems: string[];
  }>({
    skills: [],
    lunaforma: [],
    cashItems: []
  });

  // 캐릭터 이름 및 프리셋 상태
  const [characterName, setCharacterName] = useState<string>("");
  
  // 따듯한 바람 옵션 상태 (선택된 속성)
  const [warmWind, setWarmWind] = useState<string>("");
  
  // 몬스터 설정 상태
  const [monsterSettings, setMonsterSettings] = useState({
    name: "",
    size: "",
    element: "",
    race: "",
    level: 0,
    grade: "",
    mhp: 0,
    resistance: 0,
    mres: 0,
  });
  
  const [presets, setPresets] = useState<Array<{
    name: string;
    data: {
      selectedClass: string;
      baseLevel: number;
      jobLevel: number;
      stats: Stats;
      statBonus: StatBonus;
      traitStats: TraitStats;
      traitStatBonus: TraitStatBonus;
      weaponGrade: "A등급" | "B등급" | "C등급" | "D등급" | "무등급";
      weaponRefine: number;
      baseWeaponDamage: number;
      equipmentStats: typeof equipmentStats;
      skillDamageBonus: typeof skillDamageBonus;
      skillLevels: Record<string, number>;
      selectedBuffs: typeof selectedBuffs;
      warmWind?: string;
      monsterSettings?: typeof monsterSettings;
    };
  }>>([]);

  // localStorage에서 프리셋 불러오기
  const loadPresetsFromStorage = () => {
    try {
      const saved = localStorage.getItem('ragnarok-presets');
      if (saved) {
        setPresets(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load presets:', error);
    }
  };

  // 컴포넌트 마운트 시 프리셋 불러오기
  useEffect(() => {
    loadPresetsFromStorage();
  }, []);

  // 프리셋 저장
  const savePreset = () => {
    if (!characterName.trim()) {
      alert('캐릭터 이름을 입력해주세요.');
      return;
    }

    // 동일한 이름의 프리셋이 있는지 확인
    const existingIndex = presets.findIndex(preset => preset.name === characterName);

    const newPresetData = {
      name: characterName,
      data: {
        selectedClass,
        baseLevel,
        jobLevel,
        stats,
        statBonus,
        traitStats,
        traitStatBonus,
        weaponGrade,
        weaponRefine,
        baseWeaponDamage,
        equipmentStats,
        skillDamageBonus,
        skillLevels,
        selectedBuffs,
        warmWind,
        monsterSettings,
      },
    };

    let updatedPresets;
    
    if (existingIndex !== -1) {
      // 기존 프리셋 덮어쓰기
      updatedPresets = [...presets];
      updatedPresets[existingIndex] = newPresetData;
      alert(`"${characterName}" 프리셋이 업데이트되었습니다.`);
    } else {
      // 새 프리셋 추가
      if (presets.length >= 5) {
        alert('최대 5개까지만 저장할 수 있습니다.');
        return;
      }
      updatedPresets = [...presets, newPresetData];
      alert(`"${characterName}" 프리셋이 저장되었습니다.`);
    }

    setPresets(updatedPresets);
    localStorage.setItem('ragnarok-presets', JSON.stringify(updatedPresets));
  };

  // 프리셋 불러오기
  const loadPreset = (index: number) => {
    const preset = presets[index];
    if (!preset) return;

    setCharacterName(preset.name);
    setSelectedClass(preset.data.selectedClass);
    setBaseLevel(preset.data.baseLevel);
    setJobLevel(preset.data.jobLevel);
    setStats(preset.data.stats);
    setStatBonus(preset.data.statBonus);
    setTraitStats(preset.data.traitStats);
    setTraitStatBonus(preset.data.traitStatBonus);
    setWeaponGrade(preset.data.weaponGrade);
    setWeaponRefine(preset.data.weaponRefine);
    setBaseWeaponDamage(preset.data.baseWeaponDamage);
    setEquipmentStats(preset.data.equipmentStats);
    setSkillDamageBonus(preset.data.skillDamageBonus);
    setSkillLevels(preset.data.skillLevels);
    setSelectedBuffs(preset.data.selectedBuffs || { skills: [], lunaforma: [], cashItems: [] });
    
    // 따듯한 바람과 몬스터 설정 복원
    if (preset.data.warmWind !== undefined) {
      setWarmWind(preset.data.warmWind);
    }
    if (preset.data.monsterSettings) {
      setMonsterSettings(preset.data.monsterSettings);
    }

    alert(`"${preset.name}" 프리셋을 불러왔습니다.`);
  };

  // 프리셋 삭제
  const deletePreset = (index: number) => {
    const preset = presets[index];
    if (!preset) return;

    if (confirm(`"${preset.name}" 프리셋을 삭제하시겠습니까?`)) {
      const updatedPresets = presets.filter((_, i) => i !== index);
      setPresets(updatedPresets);
      localStorage.setItem('ragnarok-presets', JSON.stringify(updatedPresets));
      alert(`"${preset.name}" 프리셋이 삭제되었습니다.`);
    }
  };

  const handleEquipmentStatChange = (key: string, value: number) => {
    setEquipmentStats(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSkillDamageBonusChange = (key: string, value: number) => {
    setSkillDamageBonus(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // 선택된 직업의 타입을 가져와서 스탯 포인트 계산
  const classType = getClassType(selectedClass) || 1;
  const statPoints = selectedClass ? calculateStatPoints(baseLevel, classType) : 0;
  const traitStatPoints = selectedClass ? calculateTraitStatPoints(baseLevel) : 0;
  const skillPoints = selectedClass ? calculateSkillPoints(jobLevel) : undefined;

  // 버프 보너스 계산
  const buffBonus = calculateTotalBuffBonus(selectedBuffs);

  // STATUS MATK 보정값 계산 (버프 보너스 포함)
  const totalINT = stats.INT + statBonus.INT + (buffBonus.INT || 0);
  const totalDEX = stats.DEX + statBonus.DEX + (buffBonus.DEX || 0);
  const totalLUK = stats.LUK + statBonus.LUK + (buffBonus.LUK || 0);
  const totalSPL = traitStats.SPL + traitStatBonus.SPL + (buffBonus.SPL || 0);

  const levelCorrection = Math.floor(baseLevel / 4);
  const intCorrection = Math.floor(totalINT / 2);
  const dexCorrection = Math.floor(totalDEX / 5);
  const lukCorrection = Math.floor(totalLUK / 3);
  const splCorrection = Math.floor(totalSPL * 5);

  const statusMatkCorrection = Math.floor(
    totalINT + levelCorrection + intCorrection + dexCorrection + lukCorrection + splCorrection
  );

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

  // WEAPON MATK 계산 (무기제련MATK + 기본무기��미지)
  const weaponMatk = weaponRefinementMatk + baseWeaponDamage;

  // 장비 MATK 계산 (MATK 두 번째 입력값 - 무기 MATK)
  const calculatedEquipMatk = equipmentStats.matkMax - weaponMatk;

  // 전체 초기화 함수
  const handleResetAll = () => {
    setSelectedClass("");
    setBaseLevel(1);
    setJobLevel(1);
    setStats({
      STR: 1,
      AGI: 1,
      VIT: 1,
      INT: 1,
      DEX: 1,
      LUK: 1,
    });
    setStatBonus({
      STR: 0,
      AGI: 0,
      VIT: 0,
      INT: 0,
      DEX: 0,
      LUK: 0,
    });
    setTraitStats({
      POW: 0,
      STA: 0,
      WIS: 0,
      SPL: 0,
      CON: 0,
      CRT: 0,
    });
    setTraitStatBonus({
      POW: 0,
      STA: 0,
      WIS: 0,
      SPL: 0,
      CON: 0,
      CRT: 0,
    });
    setWeaponGrade("무등급");
    setWeaponRefine(0);
    setBaseWeaponDamage(0);
    setEquipmentStats({
      matkMin: 0,
      matkMax: 0,
      statMatk: 0,
      equipMatk: 0,
      matkPercent: 0,
      smatk: 0,
      general: 0,
      boss: 0,
      small: 0,
      medium: 0,
      large: 0,
      allSize: 0,
      neutral: 0,
      water: 0,
      earth: 0,
      fire: 0,
      wind: 0,
      poison: 0,
      holy: 0,
      shadow: 0,
      ghost: 0,
      undead: 0,
      allElement: 0,
      plant: 0,
      undeadRace: 0,
      formless: 0,
      angel: 0,
      dragon: 0,
      fish: 0,
      insect: 0,
      brute: 0,
      demon: 0,
      demiHuman: 0,
      allRace: 0,
      variableMagic: 0,
      windMagic: 0,
      waterMagic: 0,
      fireMagic: 0,
      ghostMagic: 0,
      shadowMagic: 0,
      holyMagic: 0,
      neutralMagic: 0,
      poisonMagic: 0,
      undeadMagic: 0,
      allMagic: 0,
    });
    setSkillDamageBonus({
      chungyong: 0,  // 청룡부
      backho: 0,     // 백호부
      jujak: 0,      // 주작부
      hyunmu: 0,     // 현무부
      sabangsin: 0,  // 사방신부
      sabangohaeng: 0, // 사방오행진
      saryoung: 0,   // 사령정화
    });
    setSkillLevels({});
    setSelectedBuffs({
      skills: [],
      lunaforma: [],
      cashItems: []
    });
  };

  return (
    <div className="w-full min-h-screen bg-black p-4 md:p-8">
      <div className="w-full max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-2">
            <h1 className="text-4xl font-bold text-white text-center">라그나로크</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetAll}
              className="bg-red-900/40 border-red-500/30 hover:bg-red-800/50 text-white"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              전체 초기화
            </Button>
          </div>
          <p className="text-purple-200 text-[16px]">데미지 시뮬레이터</p>
        </div>

        <Tabs defaultValue="character" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="character" className="text-base">A</TabsTrigger>
            <TabsTrigger value="item" className="text-base">B</TabsTrigger>
            <TabsTrigger value="damage" className="text-base">C</TabsTrigger>
            <TabsTrigger value="extra" className="text-base">D</TabsTrigger>
          </TabsList>

          <TabsContent value="character" className="space-y-6">
            {/* A-1, A-2, A-3을 한 페이지에 2열 레이아웃으로 표시 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 왼쪽 컬럼: 프리셋 관리, 캐릭터 설정, 스탯 분배, 특성스탯 분배 */}
              <div className="space-y-6">
                {/* 프리셋 관리 카드 */}
                <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-white">프리셋 관리</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* 캐릭터 이름 입력 및 저장 */}
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-purple-300 text-xs block mb-1">캐릭터 이름</label>
                        <input
                          type="text"
                          value={characterName}
                          onChange={(e) => setCharacterName(e.target.value)}
                          placeholder="캐릭터 이름을 입력하세요"
                          className="w-full bg-slate-700/50 border border-purple-500/50 text-white text-sm rounded-md px-3 py-2"
                          maxLength={20}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          onClick={savePreset}
                          disabled={!characterName.trim() || (presets.length >= 5 && !presets.some(p => p.name === characterName))}
                          className="bg-green-900/40 border-green-500/30 hover:bg-green-800/50 text-white border text-xs"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          저장 ({presets.length}/5)
                        </Button>
                      </div>
                    </div>

                    {/* 프리셋 목록 */}
                    {presets.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-purple-300 text-xs block">저장된 프리셋</label>
                        <div className="space-y-2">
                          {presets.map((preset, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 p-3 bg-slate-700/30 border border-purple-500/20 rounded-md"
                            >
                              <div className="flex-1">
                                <p className="text-white font-semibold text-sm">{preset.name}</p>
                                <p className="text-purple-300 text-[10px]">
                                  {preset.data.selectedClass} | Lv.{preset.data.baseLevel}/{preset.data.jobLevel}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => loadPreset(index)}
                                className="bg-blue-900/40 border-blue-500/30 hover:bg-blue-800/50 text-white border text-xs"
                              >
                                <Upload className="h-4 w-4 mr-1" />
                                불러오기
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => deletePreset(index)}
                                className="bg-red-900/40 border-red-500/30 hover:bg-red-800/50 text-white border text-xs"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-white">캐릭터 설정</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ClassSelector 
                      selectedClass={selectedClass} 
                      onClassChange={setSelectedClass} 
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <LevelInput
                        label="베이스 레벨"
                        value={baseLevel}
                        onChange={setBaseLevel}
                        min={1}
                        max={275}
                        pointLabel={selectedClass ? "스탯 포인트" : undefined}
                        pointValue={selectedClass ? statPoints : undefined}
                        secondaryPointLabel={selectedClass ? "특성스탯" : undefined}
                        secondaryPointValue={traitStatPoints}
                      />
                      
                      <LevelInput
                        label="잡 레벨"
                        value={jobLevel}
                        onChange={setJobLevel}
                        min={1}
                        max={60}
                        pointLabel={selectedClass ? "스킬 포인트" : undefined}
                        pointValue={skillPoints}
                      />
                    </div>
                    
                    {/* 따듯한 바람 옵션 */}
                    <div className="space-y-2">
                      <Label htmlFor="warm-wind-select" className="text-purple-300 text-xs">따듯한 바람 속성 선택</Label>
                      <Select value={warmWind} onValueChange={setWarmWind}>
                        <SelectTrigger id="warm-wind-select" className="w-full bg-slate-700/50 border-purple-500/30 text-white">
                          <SelectValue placeholder="속성을 선택하세요" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-purple-500/30">
                          <SelectItem value="neutralMagic" className="text-white focus:bg-slate-700 focus:text-white">
                            무속성 마법
                          </SelectItem>
                          <SelectItem value="waterMagic" className="text-white focus:bg-slate-700 focus:text-white">
                            수속성 마법
                          </SelectItem>
                          <SelectItem value="variableMagic" className="text-white focus:bg-slate-700 focus:text-white">
                            지속성 마법
                          </SelectItem>
                          <SelectItem value="fireMagic" className="text-white focus:bg-slate-700 focus:text-white">
                            화속성 마법
                          </SelectItem>
                          <SelectItem value="windMagic" className="text-white focus:bg-slate-700 focus:text-white">
                            풍속성 마법
                          </SelectItem>
                          <SelectItem value="poisonMagic" className="text-white focus:bg-slate-700 focus:text-white">
                            독속성 마법
                          </SelectItem>
                          <SelectItem value="holyMagic" className="text-white focus:bg-slate-700 focus:text-white">
                            성속성 마법
                          </SelectItem>
                          <SelectItem value="shadowMagic" className="text-white focus:bg-slate-700 focus:text-white">
                            암속성 마법
                          </SelectItem>
                          <SelectItem value="ghostMagic" className="text-white focus:bg-slate-700 focus:text-white">
                            염속성 마법
                          </SelectItem>
                          <SelectItem value="undeadMagic" className="text-white focus:bg-slate-700 focus:text-white">
                            불사속성 마법
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {selectedClass && (
                      <div className="mt-4 p-4 bg-purple-900/30 rounded-lg border border-purple-500/20">
                        <p className="text-purple-200 text-sm">
                          선택된 직업: <span className="text-white font-semibold">{selectedClass}</span>
                        </p>
                        <p className="text-purple-200 mt-1 text-sm">
                          베이스 레벨: <span className="text-white font-semibold">{baseLevel}</span> / 
                          잡 레벨: <span className="text-white font-semibold">{jobLevel}</span>
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* 스탯/특성스탯 분배 */}
                <StatDistribution
                  stats={stats}
                  onStatsChange={setStats}
                  statBonus={statBonus}
                  onStatBonusChange={setStatBonus}
                  availablePoints={statPoints}
                  buffBonus={buffBonus}
                />

                <TraitStatDistribution
                  traitStats={traitStats}
                  onTraitStatsChange={setTraitStats}
                  traitStatBonus={traitStatBonus}
                  onTraitStatBonusChange={setTraitStatBonus}
                  availablePoints={traitStatPoints}
                />
              </div>

              {/* 오른쪽 컬럼: 몬스터 설정 */}
              <div className="space-y-6">
                {/* 몬스터 설정 */}
                <Card className="bg-gradient-to-br from-slate-900 to-purple-900/20 border-purple-500/50 shadow-xl backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-white">몬스터 설정</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* 몬스터 이름 */}
                      <MonsterNameInput
                        value={monsterSettings.name}
                        onChange={(name, monsterData) => {
                          if (monsterData) {
                            setMonsterSettings(prev => ({
                              ...prev,
                              name,
                              size: monsterData.size,
                              element: monsterData.element,
                              race: monsterData.race,
                              level: monsterData.level,
                              grade: monsterData.grade,
                              mhp: monsterData.mhp,
                              mres: monsterData.mres,
                            }));
                          } else {
                            setMonsterSettings(prev => ({ ...prev, name }));
                          }
                        }}
                      />

                      {/* 몬스터 크기 */}
                      <div className="space-y-2">
                        <Label htmlFor="monster-size" className="text-purple-300 text-xs">몬스터 크기</Label>
                        <input
                          id="monster-size"
                          type="text"
                          value={monsterSettings.size}
                          onChange={(e) => setMonsterSettings(prev => ({ ...prev, size: e.target.value }))}
                          className="w-full px-3 py-2 bg-slate-700/50 border border-purple-500/30 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          placeholder="크기 입력"
                        />
                      </div>

                      {/* 몬스터 속성 */}
                      <div className="space-y-2">
                        <Label htmlFor="monster-element" className="text-purple-300 text-xs">몬스터 속성</Label>
                        <Select value={monsterSettings.element} onValueChange={(value) => setMonsterSettings(prev => ({ ...prev, element: value }))}>
                          <SelectTrigger id="monster-element" className="w-full bg-slate-700/50 border-purple-500/30 text-white">
                            <SelectValue placeholder="속성을 선택하세요" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-purple-500/30">
                            <SelectItem value="무속성1" className="text-white focus:bg-slate-700 focus:text-white">무속성1</SelectItem>
                            <SelectItem value="무속성2" className="text-white focus:bg-slate-700 focus:text-white">무속성2</SelectItem>
                            <SelectItem value="무속성3" className="text-white focus:bg-slate-700 focus:text-white">무속성3</SelectItem>
                            <SelectItem value="무속성4" className="text-white focus:bg-slate-700 focus:text-white">무속성4</SelectItem>
                            <SelectItem value="수속성1" className="text-white focus:bg-slate-700 focus:text-white">수속성1</SelectItem>
                            <SelectItem value="수속성2" className="text-white focus:bg-slate-700 focus:text-white">수속성2</SelectItem>
                            <SelectItem value="수속성3" className="text-white focus:bg-slate-700 focus:text-white">수속성3</SelectItem>
                            <SelectItem value="수속성4" className="text-white focus:bg-slate-700 focus:text-white">수속성4</SelectItem>
                            <SelectItem value="풍속성1" className="text-white focus:bg-slate-700 focus:text-white">풍속성1</SelectItem>
                            <SelectItem value="풍속성2" className="text-white focus:bg-slate-700 focus:text-white">풍속성2</SelectItem>
                            <SelectItem value="풍속성3" className="text-white focus:bg-slate-700 focus:text-white">풍속성3</SelectItem>
                            <SelectItem value="풍속성4" className="text-white focus:bg-slate-700 focus:text-white">풍속성4</SelectItem>
                            <SelectItem value="지속성1" className="text-white focus:bg-slate-700 focus:text-white">지속성1</SelectItem>
                            <SelectItem value="지속성2" className="text-white focus:bg-slate-700 focus:text-white">지속성2</SelectItem>
                            <SelectItem value="지속성3" className="text-white focus:bg-slate-700 focus:text-white">지속성3</SelectItem>
                            <SelectItem value="지속성4" className="text-white focus:bg-slate-700 focus:text-white">지속성4</SelectItem>
                            <SelectItem value="화속성1" className="text-white focus:bg-slate-700 focus:text-white">화속성1</SelectItem>
                            <SelectItem value="화속성2" className="text-white focus:bg-slate-700 focus:text-white">화속성2</SelectItem>
                            <SelectItem value="화속성3" className="text-white focus:bg-slate-700 focus:text-white">화속성3</SelectItem>
                            <SelectItem value="화속성4" className="text-white focus:bg-slate-700 focus:text-white">화속성4</SelectItem>
                            <SelectItem value="암속성1" className="text-white focus:bg-slate-700 focus:text-white">암속성1</SelectItem>
                            <SelectItem value="암속성2" className="text-white focus:bg-slate-700 focus:text-white">암속성2</SelectItem>
                            <SelectItem value="암속성3" className="text-white focus:bg-slate-700 focus:text-white">암속성3</SelectItem>
                            <SelectItem value="암속성4" className="text-white focus:bg-slate-700 focus:text-white">암속성4</SelectItem>
                            <SelectItem value="염속성1" className="text-white focus:bg-slate-700 focus:text-white">염속성1</SelectItem>
                            <SelectItem value="염속성2" className="text-white focus:bg-slate-700 focus:text-white">염속성2</SelectItem>
                            <SelectItem value="염속성3" className="text-white focus:bg-slate-700 focus:text-white">염속성3</SelectItem>
                            <SelectItem value="염속성4" className="text-white focus:bg-slate-700 focus:text-white">염속성4</SelectItem>
                            <SelectItem value="성속성1" className="text-white focus:bg-slate-700 focus:text-white">성속성1</SelectItem>
                            <SelectItem value="성속성2" className="text-white focus:bg-slate-700 focus:text-white">성속성2</SelectItem>
                            <SelectItem value="성속성3" className="text-white focus:bg-slate-700 focus:text-white">성속성3</SelectItem>
                            <SelectItem value="성속성4" className="text-white focus:bg-slate-700 focus:text-white">성속성4</SelectItem>
                            <SelectItem value="불사속성1" className="text-white focus:bg-slate-700 focus:text-white">불사속성1</SelectItem>
                            <SelectItem value="불사속성2" className="text-white focus:bg-slate-700 focus:text-white">불사속성2</SelectItem>
                            <SelectItem value="불사속성3" className="text-white focus:bg-slate-700 focus:text-white">불사속성3</SelectItem>
                            <SelectItem value="불사속성4" className="text-white focus:bg-slate-700 focus:text-white">불사속성4</SelectItem>
                            <SelectItem value="독속성1" className="text-white focus:bg-slate-700 focus:text-white">독속성1</SelectItem>
                            <SelectItem value="독속성2" className="text-white focus:bg-slate-700 focus:text-white">독속성2</SelectItem>
                            <SelectItem value="독속성3" className="text-white focus:bg-slate-700 focus:text-white">독속성3</SelectItem>
                            <SelectItem value="독속성4" className="text-white focus:bg-slate-700 focus:text-white">독속성4</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* 몬스터 종족 */}
                      <div className="space-y-2">
                        <Label htmlFor="monster-race" className="text-purple-300 text-xs">몬스터 종족</Label>
                        <input
                          id="monster-race"
                          type="text"
                          value={monsterSettings.race}
                          onChange={(e) => setMonsterSettings(prev => ({ ...prev, race: e.target.value }))}
                          className="w-full px-3 py-2 bg-slate-700/50 border border-purple-500/30 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          placeholder="종족 입력"
                        />
                      </div>

                      {/* 몬스터 레벨 */}
                      <div className="space-y-2">
                        <Label htmlFor="monster-level" className="text-purple-300 text-xs">몬스터 레벨</Label>
                        <input
                          id="monster-level"
                          type="number"
                          value={monsterSettings.level}
                          onChange={(e) => setMonsterSettings(prev => ({ ...prev, level: Number(e.target.value) }))}
                          className="w-full px-3 py-2 bg-slate-700/50 border border-purple-500/30 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          placeholder="레벨 입력"
                        />
                      </div>

                      {/* 몬스터 등급 */}
                      <div className="space-y-2">
                        <Label htmlFor="monster-grade" className="text-purple-300 text-xs">몬스터 등급</Label>
                        <input
                          id="monster-grade"
                          type="text"
                          value={monsterSettings.grade}
                          onChange={(e) => setMonsterSettings(prev => ({ ...prev, grade: e.target.value }))}
                          className="w-full px-3 py-2 bg-slate-700/50 border border-purple-500/30 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          placeholder="등급 입력"
                        />
                      </div>

                      {/* MHP */}
                      <div className="space-y-2">
                        <Label htmlFor="monster-mhp" className="text-purple-300 text-xs">MHP</Label>
                        <input
                          id="monster-mhp"
                          type="text"
                          value={monsterSettings.mhp ? monsterSettings.mhp.toLocaleString() : ''}
                          onChange={(e) => {
                            const numericValue = e.target.value.replace(/,/g, '');
                            if (numericValue === '' || !isNaN(Number(numericValue))) {
                              setMonsterSettings(prev => ({ ...prev, mhp: numericValue === '' ? 0 : Number(numericValue) }));
                            }
                          }}
                          className="w-full px-3 py-2 bg-slate-700/50 border border-purple-500/30 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          placeholder="MHP 입력"
                        />
                      </div>

                      {/* 저항무시(%) */}
                      <div className="space-y-2">
                        <Label htmlFor="monster-resistance" className="text-purple-300 text-xs">저항무시(%)</Label>
                        <input
                          id="monster-resistance"
                          type="number"
                          value={monsterSettings.resistance}
                          onChange={(e) => setMonsterSettings(prev => ({ ...prev, resistance: Number(e.target.value) }))}
                          className="w-full px-3 py-2 bg-slate-700/50 border border-purple-500/30 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          placeholder="저항무시(%) 입력"
                        />
                      </div>
                    </div>

                    {/* 스킬별 예상 데미지 */}
                    <div className="mt-6 pt-4 border-t border-purple-500/30">
                      <h3 className="text-purple-300 text-sm font-semibold mb-3">스킬별 예상 데미지</h3>
                      <div className="space-y-2">
                        {(() => {
                          // C-1 데미지 계산노트에서 계산된 값 사용
                          // 합계 계산
                          const backhoHyunmuTotal = {
                            min: skillDamages.backho.min + skillDamages.hyunmu.min,
                            max: skillDamages.backho.max + skillDamages.hyunmu.max,
                            avg: skillDamages.backho.avg + skillDamages.hyunmu.avg
                          };

                          const chungyongJujakTotal = {
                            min: skillDamages.chungyong.min + skillDamages.jujak.min,
                            max: skillDamages.chungyong.max + skillDamages.jujak.max,
                            avg: skillDamages.chungyong.avg + skillDamages.jujak.avg
                          };

                          // 불필요한 로직 제거 - 아래 주석 처리된 부분은 삭제됨
                          /*const getSkillMatk = (skillId: string): number => {
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
                            const isSabangBuffActive = selectedBuffs.skills.includes("사방오행진");
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

                          // MATK 계산
                          const baseMatkMin = statusMatkCorrection + calculatedEquipMatk + equipmentStats.matkMin;
                          const baseMatkMax = statusMatkCorrection + calculatedEquipMatk + equipmentStats.matkMax;

                          // 보정값 계산
                          const localStatMatkCorrection = equipmentStats.statMatk;
                          const localEquipMatkCorrection = equipmentStats.equipMatk;
                          const localMatkPercentCorrection = equipmentStats.matkPercent;
                          const localSmatkCorrection = equipmentStats.smatk;

                          const finalMatkMin = Math.floor(
                            baseMatkMin * 
                            (1 + (localStatMatkCorrection + localEquipMatkCorrection + localMatkPercentCorrection) / 100) +
                            localSmatkCorrection
                          );
                          const finalMatkMax = Math.floor(
                            baseMatkMax * 
                            (1 + (localStatMatkCorrection + localEquipMatkCorrection + localMatkPercentCorrection) / 100) +
                            localSmatkCorrection
                          );

                          // 몬스터 설정 처리
                          const monsterElementValue = parseInt(monsterSettings.element) || 0;
                          const warmWindValue = parseInt(warmWind) || 0;
                          const monsterRatio = 100; // 기본값 100%

                          // 스킬별 데미지 계산
                          const skillDamages: Record<string, { min: number; max: number; avg: number }> = {};
                          const skillIds = ['backho', 'hyunmu', 'chungyong', 'jujak', 'sabangsin', 'sabangohaeng'];

                          skillIds.forEach(skillId => {
                            const skillMatk = getSkillMatk(skillId);
                            const splCoeff = skillId === 'backho' ? 1.5 :
                                           skillId === 'hyunmu' ? 1.5 :
                                           skillId === 'chungyong' ? 3 :
                                           skillId === 'jujak' ? 2 :
                                           skillId === 'sabangsin' ? 6 :
                                           skillId === 'sabangohaeng' ? 3 : 0;

                            skillDamages[skillId] = calculateSkillDamage({
                              skillId,
                              skillMatk,
                              baseLevel,
                              totalSPL,
                              splCoeff,
                              finalMatkMin,
                              finalMatkMax,
                              skillDamageBonus: skillDamageBonus[skillId as keyof typeof skillDamageBonus] || 0,
                              warmWind: warmWindValue,
                              monsterElement: monsterElementValue,
                              monsterMres: monsterSettings.mres,
                              monsterRatio
                            });
                          });

                          // 불필요한 로직 제거
                          */

                          return (
                            <>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="text-purple-200">백호부</div>
                                <div className="text-right">
                                  <div className="text-yellow-400 font-bold">{skillDamages.backho.avg.toLocaleString()}</div>
                                  <div className="text-xs text-purple-300">
                                    MIN: {skillDamages.backho.min.toLocaleString()} / MAX: {skillDamages.backho.max.toLocaleString()}
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="text-purple-200">현무부</div>
                                <div className="text-right">
                                  <div className="text-yellow-400 font-bold">{skillDamages.hyunmu.avg.toLocaleString()}</div>
                                  <div className="text-xs text-purple-300">
                                    MIN: {skillDamages.hyunmu.min.toLocaleString()} / MAX: {skillDamages.hyunmu.max.toLocaleString()}
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm font-semibold border-t border-purple-500/20 pt-2">
                                <div className="text-purple-300">합계</div>
                                <div className="text-right">
                                  <div className="text-yellow-400 font-bold">{backhoHyunmuTotal.avg.toLocaleString()}</div>
                                  <div className="text-xs text-purple-300 font-normal">
                                    MIN: {backhoHyunmuTotal.min.toLocaleString()} / MAX: {backhoHyunmuTotal.max.toLocaleString()}
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                                <div className="text-purple-200">청룡부</div>
                                <div className="text-right">
                                  <div className="text-yellow-400 font-bold">{skillDamages.chungyong.avg.toLocaleString()}</div>
                                  <div className="text-xs text-purple-300">
                                    MIN: {skillDamages.chungyong.min.toLocaleString()} / MAX: {skillDamages.chungyong.max.toLocaleString()}
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="text-purple-200">주작부</div>
                                <div className="text-right">
                                  <div className="text-yellow-400 font-bold">{skillDamages.jujak.avg.toLocaleString()}</div>
                                  <div className="text-xs text-purple-300">
                                    MIN: {skillDamages.jujak.min.toLocaleString()} / MAX: {skillDamages.jujak.max.toLocaleString()}
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm font-semibold border-t border-purple-500/20 pt-2">
                                <div className="text-purple-300">합계</div>
                                <div className="text-right">
                                  <div className="text-yellow-400 font-bold">{chungyongJujakTotal.avg.toLocaleString()}</div>
                                  <div className="text-xs text-purple-300 font-normal">
                                    MIN: {chungyongJujakTotal.min.toLocaleString()} / MAX: {chungyongJujakTotal.max.toLocaleString()}
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                                <div className="text-purple-200">사방신부</div>
                                <div className="text-right">
                                  <div className="text-yellow-400 font-bold">{skillDamages.sabangsin.avg.toLocaleString()}</div>
                                  <div className="text-xs text-purple-300">
                                    MIN: {skillDamages.sabangsin.min.toLocaleString()} / MAX: {skillDamages.sabangsin.max.toLocaleString()}
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="text-purple-200">사방오행진</div>
                                <div className="text-right">
                                  <div className="text-yellow-400 font-bold">{skillDamages.sabangohaeng.avg.toLocaleString()}</div>
                                  <div className="text-xs text-purple-300">
                                    MIN: {skillDamages.sabangohaeng.min.toLocaleString()} / MAX: {skillDamages.sabangohaeng.max.toLocaleString()}
                                  </div>
                                </div>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="item" className="space-y-6">
            <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white">아이템 설정</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="magic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="magic">B-1</TabsTrigger>
                    <TabsTrigger value="ranged">B-2</TabsTrigger>
                  </TabsList>

                  <TabsContent value="magic" className="space-y-4">
                    {/* 마법 데미지용 하위 탭 추가 */}
                    <Tabs defaultValue="weapon" className="w-full">
                      <TabsList className="grid w-full grid-cols-4 mb-4">
                        <TabsTrigger value="weapon">B-1-1</TabsTrigger>
                        <TabsTrigger value="equipment">B-1-2</TabsTrigger>
                        <TabsTrigger value="skill">B-1-3</TabsTrigger>
                        <TabsTrigger value="buff">B-1-4</TabsTrigger>
                      </TabsList>

                      <TabsContent value="weapon" className="space-y-4">
                        <Card className="bg-slate-700/30 border-purple-500/20">
                          <CardHeader>
                            <CardTitle className="text-white text-lg">무기 설정</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {/* 라벨 행 */}
                            <div className="grid grid-cols-3 gap-4 mb-2">
                              <label className="text-purple-300 text-sm">무기등급</label>
                              <label className="text-purple-300 text-sm">무기제련도</label>
                              <label className="text-purple-300 text-sm">기본무기데미지</label>
                            </div>

                            {/* 입력 필드 행 */}
                            <div className="grid grid-cols-3 gap-4">
                              {/* 무기등급 */}
                              <select
                                value={weaponGrade}
                                onChange={(e) => setWeaponGrade(e.target.value as any)}
                                className="bg-slate-700/50 border border-purple-500/50 text-white rounded-md px-3 py-2"
                              >
                                <option value="A등급">A등급</option>
                                <option value="B등급">B등급</option>
                                <option value="C등급">C등급</option>
                                <option value="D등급">D등급</option>
                                <option value="무등급">무등급</option>
                              </select>

                              {/* 무기제련도 */}
                              <input
                                type="number"
                                min={0}
                                max={20}
                                value={weaponRefine}
                                onChange={(e) => {
                                  const value = Number(e.target.value);
                                  if (value >= 0 && value <= 20) {
                                    setWeaponRefine(value);
                                  }
                                }}
                                className="bg-slate-700/50 border border-purple-500/50 text-white rounded-md px-3 py-2"
                              />

                              {/* 기본무기데미지 */}
                              <input
                                type="number"
                                min={0}
                                value={baseWeaponDamage}
                                onChange={(e) => setBaseWeaponDamage(Number(e.target.value))}
                                className="bg-slate-700/50 border border-purple-500/50 text-white rounded-md px-3 py-2"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="equipment" className="space-y-4">
                        <Card className="bg-slate-700/30 border-purple-500/20">
                          <CardHeader>
                            <CardTitle className="text-white text-lg">장비 설정</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-4 gap-4">
                              {/* 첫 번째 열 */}
                              <div className="space-y-3">
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">MATK</label>
                                  <div className="grid grid-cols-2 gap-1">
                                    <input 
                                      type="number" 
                                      value={statusMatkCorrection} 
                                      disabled
                                      className="w-full bg-slate-600/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm cursor-not-allowed" 
                                      title="STATUS MATK 자동 계산값"
                                    />
                                    <input type="number" value={equipmentStats.matkMax} onChange={(e) => handleEquipmentStatChange('matkMax', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                  </div>
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">무기 MATK</label>
                                  <input 
                                    type="number" 
                                    value={weaponMatk} 
                                    disabled
                                    className="w-full bg-slate-600/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm cursor-not-allowed" 
                                    title="WEAPON MATK 자동 산값"
                                  />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">장비 MATK</label>
                                  <input 
                                    type="number" 
                                    value={calculatedEquipMatk} 
                                    disabled
                                    className="w-full bg-slate-600/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm cursor-not-allowed" 
                                    title="MATK 두 번째 값 - 무기 MATK"
                                  />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">MATK %</label>
                                  <input type="number" value={equipmentStats.matkPercent} onChange={(e) => handleEquipmentStatChange('matkPercent', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">SMATK</label>
                                  <input type="number" value={equipmentStats.smatk} onChange={(e) => handleEquipmentStatChange('smatk', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">일반적</label>
                                  <input type="number" value={equipmentStats.general} onChange={(e) => handleEquipmentStatChange('general', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">보스형</label>
                                  <input type="number" value={equipmentStats.boss} onChange={(e) => handleEquipmentStatChange('boss', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">소형</label>
                                  <input type="number" value={equipmentStats.small} onChange={(e) => handleEquipmentStatChange('small', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">중형</label>
                                  <input type="number" value={equipmentStats.medium} onChange={(e) => handleEquipmentStatChange('medium', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">대형</label>
                                  <input type="number" value={equipmentStats.large} onChange={(e) => handleEquipmentStatChange('large', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">모든 크기 적</label>
                                  <input type="number" value={equipmentStats.allSize} onChange={(e) => handleEquipmentStatChange('allSize', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                              </div>

                              {/* 두 번째 열 */}
                              <div className="space-y-3">
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">무속성</label>
                                  <input type="number" value={equipmentStats.neutral} onChange={(e) => handleEquipmentStatChange('neutral', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">수속성</label>
                                  <input type="number" value={equipmentStats.water} onChange={(e) => handleEquipmentStatChange('water', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">지속성</label>
                                  <input type="number" value={equipmentStats.earth} onChange={(e) => handleEquipmentStatChange('earth', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">화속성</label>
                                  <input type="number" value={equipmentStats.fire} onChange={(e) => handleEquipmentStatChange('fire', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">풍속성</label>
                                  <input type="number" value={equipmentStats.wind} onChange={(e) => handleEquipmentStatChange('wind', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">독속성</label>
                                  <input type="number" value={equipmentStats.poison} onChange={(e) => handleEquipmentStatChange('poison', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">성속성</label>
                                  <input type="number" value={equipmentStats.holy} onChange={(e) => handleEquipmentStatChange('holy', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">암속성</label>
                                  <input type="number" value={equipmentStats.shadow} onChange={(e) => handleEquipmentStatChange('shadow', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">염속성</label>
                                  <input type="number" value={equipmentStats.ghost} onChange={(e) => handleEquipmentStatChange('ghost', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">불사속성</label>
                                  <input type="number" value={equipmentStats.undead} onChange={(e) => handleEquipmentStatChange('undead', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">모든 속성 적</label>
                                  <input type="number" value={equipmentStats.allElement} onChange={(e) => handleEquipmentStatChange('allElement', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                              </div>

                              {/* 세 번째 열 */}
                              <div className="space-y-3">
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">식물형</label>
                                  <input type="number" value={equipmentStats.plant} onChange={(e) => handleEquipmentStatChange('plant', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">불사형</label>
                                  <input type="number" value={equipmentStats.undeadRace} onChange={(e) => handleEquipmentStatChange('undeadRace', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">무형</label>
                                  <input type="number" value={equipmentStats.formless} onChange={(e) => handleEquipmentStatChange('formless', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">천사형</label>
                                  <input type="number" value={equipmentStats.angel} onChange={(e) => handleEquipmentStatChange('angel', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">용족</label>
                                  <input type="number" value={equipmentStats.dragon} onChange={(e) => handleEquipmentStatChange('dragon', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">어패형</label>
                                  <input type="number" value={equipmentStats.fish} onChange={(e) => handleEquipmentStatChange('fish', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">곤충형</label>
                                  <input type="number" value={equipmentStats.insect} onChange={(e) => handleEquipmentStatChange('insect', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">동물형</label>
                                  <input type="number" value={equipmentStats.brute} onChange={(e) => handleEquipmentStatChange('brute', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">악마형</label>
                                  <input type="number" value={equipmentStats.demon} onChange={(e) => handleEquipmentStatChange('demon', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">인간형</label>
                                  <input type="number" value={equipmentStats.demiHuman} onChange={(e) => handleEquipmentStatChange('demiHuman', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">모든 종족 몬스터</label>
                                  <input type="number" value={equipmentStats.allRace} onChange={(e) => handleEquipmentStatChange('allRace', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                              </div>

                              {/* 네 번째 열 */}
                              <div className="space-y-3">
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">지속성 마법</label>
                                  <input type="number" value={equipmentStats.variableMagic} onChange={(e) => handleEquipmentStatChange('variableMagic', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">풍속성 마법</label>
                                  <input type="number" value={equipmentStats.windMagic} onChange={(e) => handleEquipmentStatChange('windMagic', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">수속성 마법</label>
                                  <input type="number" value={equipmentStats.waterMagic} onChange={(e) => handleEquipmentStatChange('waterMagic', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">화속성 마법</label>
                                  <input type="number" value={equipmentStats.fireMagic} onChange={(e) => handleEquipmentStatChange('fireMagic', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">염속성 마법</label>
                                  <input type="number" value={equipmentStats.ghostMagic} onChange={(e) => handleEquipmentStatChange('ghostMagic', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">암속성 마법</label>
                                  <input type="number" value={equipmentStats.shadowMagic} onChange={(e) => handleEquipmentStatChange('shadowMagic', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">성속성 마법</label>
                                  <input type="number" value={equipmentStats.holyMagic} onChange={(e) => handleEquipmentStatChange('holyMagic', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">무속성 마법</label>
                                  <input type="number" value={equipmentStats.neutralMagic} onChange={(e) => handleEquipmentStatChange('neutralMagic', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">독속성 마법</label>
                                  <input type="number" value={equipmentStats.poisonMagic} onChange={(e) => handleEquipmentStatChange('poisonMagic', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">불사속성 마법</label>
                                  <input type="number" value={equipmentStats.undeadMagic} onChange={(e) => handleEquipmentStatChange('undeadMagic', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                                <div>
                                  <label className="text-purple-300 text-xs block mb-1">모든 속성 마법</label>
                                  <input type="number" value={equipmentStats.allMagic} onChange={(e) => handleEquipmentStatChange('allMagic', Number(e.target.value))} className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* 스킬 증뎀 섹션 */}
                        <Card className="bg-slate-700/30 border-purple-500/20">
                          <CardHeader>
                            <CardTitle className="text-white text-lg">스킬증뎀</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-4 gap-4">
                              <div>
                                <label className="text-purple-300 text-xs block mb-1">청룡부</label>
                                <input 
                                  type="number" 
                                  value={skillDamageBonus.chungyong} 
                                  onChange={(e) => handleSkillDamageBonusChange('chungyong', Number(e.target.value))} 
                                  className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" 
                                />
                              </div>
                              <div>
                                <label className="text-purple-300 text-xs block mb-1">백호부</label>
                                <input 
                                  type="number" 
                                  value={skillDamageBonus.backho} 
                                  onChange={(e) => handleSkillDamageBonusChange('backho', Number(e.target.value))} 
                                  className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" 
                                />
                              </div>
                              <div>
                                <label className="text-purple-300 text-xs block mb-1">주작부</label>
                                <input 
                                  type="number" 
                                  value={skillDamageBonus.jujak} 
                                  onChange={(e) => handleSkillDamageBonusChange('jujak', Number(e.target.value))} 
                                  className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" 
                                />
                              </div>
                              <div>
                                <label className="text-purple-300 text-xs block mb-1">현무부</label>
                                <input 
                                  type="number" 
                                  value={skillDamageBonus.hyunmu} 
                                  onChange={(e) => handleSkillDamageBonusChange('hyunmu', Number(e.target.value))} 
                                  className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" 
                                />
                              </div>
                              <div>
                                <label className="text-purple-300 text-xs block mb-1">사방신부</label>
                                <input 
                                  type="number" 
                                  value={skillDamageBonus.sabangsin} 
                                  onChange={(e) => handleSkillDamageBonusChange('sabangsin', Number(e.target.value))} 
                                  className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" 
                                />
                              </div>
                              <div>
                                <label className="text-purple-300 text-xs block mb-1">사방오행진</label>
                                <input 
                                  type="number" 
                                  value={skillDamageBonus.sabangohaeng} 
                                  onChange={(e) => handleSkillDamageBonusChange('sabangohaeng', Number(e.target.value))} 
                                  className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" 
                                />
                              </div>
                              <div>
                                <label className="text-purple-300 text-xs block mb-1">사령정화</label>
                                <input 
                                  type="number" 
                                  value={skillDamageBonus.saryoung} 
                                  onChange={(e) => handleSkillDamageBonusChange('saryoung', Number(e.target.value))} 
                                  className="w-full bg-slate-700/50 border border-purple-500/50 text-white rounded px-2 py-1 text-sm" 
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="skill" className="space-y-4">
                        <SkillTree
                          availablePoints={skillPoints || 0}
                          skillLevels={skillLevels}
                          onSkillLevelsChange={setSkillLevels}
                          isSabangBuffActive={selectedBuffs.skills.includes("사방오행진")}
                          onActiveFormulasChange={setActiveSkillFormulas}
                        />
                      </TabsContent>

                      <TabsContent value="buff" className="space-y-4">
                        <BuffSettings
                          selectedBuffs={selectedBuffs}
                          onBuffsChange={setSelectedBuffs}
                        />
                      </TabsContent>
                    </Tabs>
                  </TabsContent>

                  <TabsContent value="ranged" className="space-y-4">
                    <div className="p-8 text-center text-purple-300">
                      <p className="text-lg">원거리물리(크리) 데미지 설정</p>
                      <p className="mt-2 text-sm">준비 중입니다.</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="damage" className="space-y-6">
            {/* C 탭 하위 메뉴 추가 */}
            <Tabs defaultValue="magic-damage" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="magic-damage">C-1</TabsTrigger>
                <TabsTrigger value="ranged-damage">C-2</TabsTrigger>
              </TabsList>

              <TabsContent value="magic-damage" className="space-y-6">
                <DamageCalculation
                  baseLevel={baseLevel}
                  stats={stats}
                  statBonus={statBonus}
                  traitStats={traitStats}
                  traitStatBonus={traitStatBonus}
                  weaponGrade={weaponGrade}
                  weaponRefine={weaponRefine}
                  baseWeaponDamage={baseWeaponDamage}
                  statusMatkCorrection={statusMatkCorrection}
                  equipMatkMax={equipmentStats.matkMax}
                  weaponMatk={weaponMatk}
                  calculatedEquipMatk={calculatedEquipMatk}
                  matkPercent={equipmentStats.matkPercent}
                  smatk={equipmentStats.smatk}
                  general={equipmentStats.general}
                  boss={equipmentStats.boss}
                  allSize={equipmentStats.allSize}
                  small={equipmentStats.small}
                  medium={equipmentStats.medium}
                  large={equipmentStats.large}
                  allElement={equipmentStats.allElement}
                  neutral={equipmentStats.neutral}
                  water={equipmentStats.water}
                  earth={equipmentStats.earth}
                  fire={equipmentStats.fire}
                  wind={equipmentStats.wind}
                  poison={equipmentStats.poison}
                  holy={equipmentStats.holy}
                  shadow={equipmentStats.shadow}
                  ghost={equipmentStats.ghost}
                  undead={equipmentStats.undead}
                  allRace={equipmentStats.allRace}
                  plant={equipmentStats.plant}
                  undeadRace={equipmentStats.undeadRace}
                  formless={equipmentStats.formless}
                  angel={equipmentStats.angel}
                  dragon={equipmentStats.dragon}
                  fish={equipmentStats.fish}
                  insect={equipmentStats.insect}
                  brute={equipmentStats.brute}
                  demon={equipmentStats.demon}
                  demiHuman={equipmentStats.demiHuman}
                  allMagic={equipmentStats.allMagic}
                  variableMagic={equipmentStats.variableMagic}
                  windMagic={equipmentStats.windMagic}
                  waterMagic={equipmentStats.waterMagic}
                  fireMagic={equipmentStats.fireMagic}
                  ghostMagic={equipmentStats.ghostMagic}
                  shadowMagic={equipmentStats.shadowMagic}
                  holyMagic={equipmentStats.holyMagic}
                  neutralMagic={equipmentStats.neutralMagic}
                  poisonMagic={equipmentStats.poisonMagic}
                  undeadMagic={equipmentStats.undeadMagic}
                  buffBonus={buffBonus}
                  skillDamageBonus={skillDamageBonus}
                  skillLevels={skillLevels}
                  monsterSize={monsterSettings.size}
                  monsterElement={monsterSettings.element}
                  monsterRace={monsterSettings.race}
                  monsterGrade={monsterSettings.grade}
                  warmWind={warmWind}
                  monsterName={monsterSettings.name}
                  resistanceIgnore={monsterSettings.resistance}
                  activeSkillFormulas={activeSkillFormulas}
                  isSabangBuffActive={selectedBuffs.skills.includes("사방오행진")}
                  onDamageCalculated={setSkillDamages}
                />
              </TabsContent>

              <TabsContent value="ranged-damage" className="space-y-6">
                <div className="p-8 text-center text-purple-300">
                  <p className="text-lg">원거리물리(크리) 데미지 계산</p>
                  <p className="mt-2 text-sm">준비 중입니다.</p>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="extra" className="space-y-6">
            <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white">데이터 테이블</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="element-table" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="element-table">D-1 속성표 확인</TabsTrigger>
                    <TabsTrigger value="monster-info">D-2 몬스터 정보</TabsTrigger>
                  </TabsList>

                  <TabsContent value="element-table" className="space-y-4">
                    <ElementTable />
                  </TabsContent>

                  <TabsContent value="monster-info" className="space-y-4">
                    <MonsterInfo onSelectMonster={setMonsterSettings} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}