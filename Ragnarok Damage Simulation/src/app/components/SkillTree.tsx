import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Plus, Minus } from "lucide-react";

// 스킬 아이콘 임포트
import skillIcon1 from "figma:asset/c029e702ec40abf5ec38a0636c0dab02ece7cede.png";
import skillIcon2 from "figma:asset/74c0d69f84698654d905b58baa66e8a86b3906f1.png";
import skillIcon3 from "figma:asset/517e09d95196599be87d3ce3eadccef99661c727.png";
import skillIcon4 from "figma:asset/c4712336b30c8fe64c8a2f71bafad025806e7a0c.png";
import skillIcon5 from "figma:asset/8734d5f7905ad33421a81b09ebb04a7c29e4a51f.png";
import skillIcon6 from "figma:asset/a9337b31dae670c11dbe532c8fd9cbe127c7d405.png";
import skillIcon7 from "figma:asset/3b7a1465fb03cb06019b2525f36e7450825b5214.png";
import skillIcon8 from "figma:asset/b14de5315dbae183a226902e413737251b17557e.png";
import skillIcon9 from "figma:asset/98ae2e330ff037f9aa7c1eedfb7d27639e53d186.png";
import skillIcon10 from "figma:asset/5fa01b1d1f8923859541def83e035a92cd53904d.png";
import skillIcon11 from "figma:asset/95ac4984504d824398a58372a27c296abdb7b877.png";
import skillIcon12 from "figma:asset/a20d15147c91f0588f08372fec98984dae350b46.png";
import skillIcon13 from "figma:asset/1abfb6b5ce854db5bf2ec599fd730ef545e94177.png";
import skillIcon14 from "figma:asset/6dc76068cacb906fdc80b8cf7b698270a66b6c8a.png";
import skillIcon15 from "figma:asset/1f356029f8e960139cdf160c8c2c94865d4578f1.png";
import skillIcon16 from "figma:asset/1bca21283fa3ac1031b6e16b8e8ff9e6e3b278d7.png";
import skillIcon17 from "figma:asset/34e2d60d0f41dbb69c6571cc0850c2c4aae245f2.png";

interface SkillRequirement {
  skill: string;
  level: number;
}

interface Skill {
  id: string;
  name: string;
  maxLevel: number;
  icon: string;
  requirements: SkillRequirement[];
}

export interface ActiveSkillFormula {
  name: string;
  level: number;
  normalMatk: number;
  normalFormula: string;
  buffName: string;
  buffMatk: number;
  buffFormula: string;
}

interface SkillTreeProps {
  availablePoints: number;
  skillLevels: Record<string, number>;
  onSkillLevelsChange: (levels: Record<string, number>) => void;
  isSabangBuffActive?: boolean;
  onActiveFormulasChange?: (formulas: ActiveSkillFormula[]) => void;
}

const SKILLS: Skill[] = [
  { id: "youngdo", name: "영도술 연마", maxLevel: 10, icon: skillIcon1, requirements: [] },
  { id: "bujuk", name: "부적 연마", maxLevel: 10, icon: skillIcon2, requirements: [] },
  { id: "suho", name: "수호부", maxLevel: 5, icon: skillIcon3, requirements: [{ skill: "bujuk", level: 1 }] },
  { id: "musa", name: "무사부", maxLevel: 5, icon: skillIcon4, requirements: [{ skill: "bujuk", level: 1 }] },
  { id: "bubsa", name: "법사부", maxLevel: 5, icon: skillIcon5, requirements: [{ skill: "bujuk", level: 1 }] },
  { id: "ohaeng", name: "오행부", maxLevel: 5, icon: skillIcon6, requirements: [{ skill: "bujuk", level: 1 }] },
  { id: "suhon", name: "수혼일신", maxLevel: 5, icon: skillIcon7, requirements: [{ skill: "youngdo", level: 3 }] },
  { id: "saryoung", name: "사령정화", maxLevel: 5, icon: skillIcon8, requirements: [{ skill: "suhon", level: 1 }] },
  { id: "youngdobu", name: "영도부", maxLevel: 5, icon: skillIcon9, requirements: [{ skill: "youngdo", level: 1 }] },
  { id: "sunang", name: "서낭당", maxLevel: 5, icon: skillIcon10, requirements: [{ skill: "youngdo", level: 3 }, { skill: "bujuk", level: 3 }] },
  { id: "chungyong", name: "청룡부", maxLevel: 5, icon: skillIcon11, requirements: [{ skill: "youngdobu", level: 1 }] },
  { id: "backho", name: "백호부", maxLevel: 5, icon: skillIcon12, requirements: [{ skill: "chungyong", level: 1 }] },
  { id: "jujak", name: "주작부", maxLevel: 5, icon: skillIcon13, requirements: [{ skill: "backho", level: 1 }] },
  { id: "hyunmu", name: "현무부", maxLevel: 5, icon: skillIcon14, requirements: [{ skill: "jujak", level: 1 }] },
  { id: "sabangsin", name: "사방신부", maxLevel: 5, icon: skillIcon15, requirements: [{ skill: "chungyong", level: 1 }, { skill: "backho", level: 1 }, { skill: "jujak", level: 1 }, { skill: "hyunmu", level: 1 }] },
  { id: "sabangohaeng", name: "사방오행진", maxLevel: 5, icon: skillIcon16, requirements: [{ skill: "youngdo", level: 3 }, { skill: "sabangsin", level: 1 }, { skill: "ohaeng", level: 1 }] },
  { id: "chunjishin", name: "천지신령", maxLevel: 10, icon: skillIcon17, requirements: [{ skill: "ohaeng", level: 1 }] },
];

// 공격 스킬 공식 데이터
const SKILL_FORMULAS = [
  {
    id: "chungyong",
    name: "청룡부",
    levels: [
      { level: 1, normalMatk: 3100, normalFormula: "(부적연마LV*15)", buffName: "사방오행진", buffMatk: 3900, buffFormula: "(부적연마LV*15)" },
      { level: 2, normalMatk: 5350, normalFormula: "(부적연마LV*30)", buffName: "사방오행진", buffMatk: 6850, buffFormula: "(부적연마LV*30)" },
      { level: 3, normalMatk: 7600, normalFormula: "(부적연마LV*45)", buffName: "사방오행진", buffMatk: 9800, buffFormula: "(부적연마LV*45)" },
      { level: 4, normalMatk: 9850, normalFormula: "(부적연마LV*60)", buffName: "사방오행진", buffMatk: 12750, buffFormula: "(부적연마LV*60)" },
      { level: 5, normalMatk: 12100, normalFormula: "(부적연마LV*75)", buffName: "사방오행진", buffMatk: 15700, buffFormula: "(부적연마LV*75)" },
    ],
  },
  {
    id: "backho",
    name: "백호부",
    levels: [
      { level: 1, normalMatk: 1300, normalFormula: "(부적연마LV*15)", buffName: "사방오행진", buffMatk: 1800, buffFormula: "(부적연마LV*15)" },
      { level: 2, normalMatk: 2400, normalFormula: "(부적연마LV*30)", buffName: "사방오행진", buffMatk: 3200, buffFormula: "(부적연마LV*30)" },
      { level: 3, normalMatk: 3400, normalFormula: "(부적연마LV*45)", buffName: "사방오행진", buffMatk: 4600, buffFormula: "(부적연마LV*45)" },
      { level: 4, normalMatk: 4400, normalFormula: "(부적연마LV*60)", buffName: "사방오행진", buffMatk: 6000, buffFormula: "(부적연마LV*60)" },
      { level: 5, normalMatk: 5400, normalFormula: "(부적연마LV*75)", buffName: "사방오행진", buffMatk: 7400, buffFormula: "(부적연마LV*75)" },
    ],
  },
  {
    id: "jujak",
    name: "주작부",
    levels: [
      { level: 1, normalMatk: 2850, normalFormula: "(부적연마LV*15)", buffName: "사방오행진", buffMatk: 3450, buffFormula: "(부적연마LV*15)" },
      { level: 2, normalMatk: 4300, normalFormula: "(부적연마LV*30)", buffName: "사방오행진", buffMatk: 5300, buffFormula: "(부적연마LV*30)" },
      { level: 3, normalMatk: 5750, normalFormula: "(부적연마LV*45)", buffName: "사방오행진", buffMatk: 7150, buffFormula: "(부적연마LV*45)" },
      { level: 4, normalMatk: 7200, normalFormula: "(부적연마LV*60)", buffName: "사방오행진", buffMatk: 9000, buffFormula: "(부적연마LV*60)" },
      { level: 5, normalMatk: 8650, normalFormula: "(부적연마LV*75)", buffName: "사방오행진", buffMatk: 10850, buffFormula: "(부적연마LV*75)" },
    ],
  },
  {
    id: "hyunmu",
    name: "현무부",
    levels: [
      { level: 1, normalMatk: 3750, normalFormula: "(부적연마LV*15)", buffName: "사방오행진", buffMatk: 4400, buffFormula: "(부적연마LV*15)" },
      { level: 2, normalMatk: 5350, normalFormula: "(부적연마LV*30)", buffName: "사방오행진", buffMatk: 6500, buffFormula: "(부적연마LV*30)" },
      { level: 3, normalMatk: 6950, normalFormula: "(부적연마LV*45)", buffName: "사방오행진", buffMatk: 8600, buffFormula: "(부적연마LV*45)" },
      { level: 4, normalMatk: 8550, normalFormula: "(부적연마LV*60)", buffName: "사방오행진", buffMatk: 10700, buffFormula: "(부적연마LV*60)" },
      { level: 5, normalMatk: 10150, normalFormula: "(부적연마LV*75)", buffName: "사방오행진", buffMatk: 12800, buffFormula: "(부적연마LV*75)" },
    ],
  },
  {
    id: "sabangsin",
    name: "사방신부",
    levels: [
      { level: 1, normalMatk: 300, normalFormula: "(부적연마LV*15)", buffName: "사방오행진", buffMatk: 2100, buffFormula: "(부적연마LV*15)" },
      { level: 2, normalMatk: 550, normalFormula: "(부적연마LV*30)", buffName: "사방오행진", buffMatk: 3850, buffFormula: "(부적연마LV*30)" },
      { level: 3, normalMatk: 800, normalFormula: "(부적연마LV*45)", buffName: "사방오행진", buffMatk: 5600, buffFormula: "(부적연마LV*45)" },
      { level: 4, normalMatk: 1050, normalFormula: "(부적연마LV*60)", buffName: "사방오행진", buffMatk: 7350, buffFormula: "(부적연마LV*60)" },
      { level: 5, normalMatk: 1300, normalFormula: "(부적연마LV*75)", buffName: "사방오행진", buffMatk: 9100, buffFormula: "(부적연마LV*75)" },
    ],
  },
  {
    id: "sabangohaeng",
    name: "사방오행진",
    levels: [
      { level: 1, normalMatk: 12500, normalFormula: "((부적연마LV+영도술 연마LV)*15)", buffName: "", buffMatk: 0, buffFormula: "" },
      { level: 2, normalMatk: 22500, normalFormula: "((부적연마LV+영도술 연마LV)*30)", buffName: "", buffMatk: 0, buffFormula: "" },
      { level: 3, normalMatk: 32500, normalFormula: "((부적연마LV+영도술 연마LV)*45)", buffName: "", buffMatk: 0, buffFormula: "" },
      { level: 4, normalMatk: 42500, normalFormula: "((부적연마LV+영도술 연마LV)*60)", buffName: "", buffMatk: 0, buffFormula: "" },
      { level: 5, normalMatk: 52500, normalFormula: "((부적연마LV+영도술 연마LV)*75)", buffName: "", buffMatk: 0, buffFormula: "" },
    ],
  },
  {
    id: "saryoung",
    name: "사령정화",
    levels: [
      { level: 1, normalMatk: 150, normalFormula: "((영도술 연마LV*2)*20)", buffName: "사령의 저주", buffMatk: 250, buffFormula: "((영도술 연마LV*2)*20)" },
      { level: 2, normalMatk: 300, normalFormula: "((영도술 연마LV*2)*20)", buffName: "사령의 저주", buffMatk: 500, buffFormula: "((영도술 연마LV*2)*20)" },
      { level: 3, normalMatk: 450, normalFormula: "((영도술 연마LV*2)*20)", buffName: "사령의 저주", buffMatk: 750, buffFormula: "((영도술 연마LV*2)*20)" },
      { level: 4, normalMatk: 600, normalFormula: "((영도술 연마LV*2)*20)", buffName: "사령의 저주", buffMatk: 1000, buffFormula: "((영도술 연마LV*2)*20)" },
      { level: 5, normalMatk: 750, normalFormula: "((영도술 연마LV*2)*20)", buffName: "사령의 저주", buffMatk: 1250, buffFormula: "((영도술 연마LV*2)*20)" },
    ],
  },
];

export function SkillTree({ availablePoints = 0, skillLevels, onSkillLevelsChange, isSabangBuffActive = false, onActiveFormulasChange }: SkillTreeProps) {
  const usedPoints = Object.values(skillLevels).reduce((sum, level) => sum + level, 0);
  const remainingPoints = availablePoints - usedPoints;

  const canLearnSkill = (skill: Skill): boolean => {
    if (!skill.requirements.length) return true;
    
    return skill.requirements.every(req => {
      const currentLevel = skillLevels[req.skill] || 0;
      return currentLevel >= req.level;
    });
  };

  const increaseSkillLevel = (skillId: string, maxLevel: number) => {
    const currentLevel = skillLevels[skillId] || 0;
    if (currentLevel < maxLevel) {
      const newLevels = { ...skillLevels };
      
      // 현재 스킬 레벨 증가
      newLevels[skillId] = currentLevel + 1;
      
      // 선행 스킬 자동 투자
      const skill = SKILLS.find(s => s.id === skillId);
      if (skill && skill.requirements.length > 0) {
        skill.requirements.forEach(req => {
          const requiredLevel = req.level;
          const currentRequiredLevel = newLevels[req.skill] || 0;
          
          // 선행 스킬이 필요한 레벨보다 낮으면 자동으로 올림
          if (currentRequiredLevel < requiredLevel) {
            newLevels[req.skill] = requiredLevel;
            
            // 재귀적으로 선행 스킬의 선행 스킬도 체크
            const requiredSkill = SKILLS.find(s => s.id === req.skill);
            if (requiredSkill && requiredSkill.requirements.length > 0) {
              const autoIncrease = (reqSkill: Skill, targetLevel: number) => {
                reqSkill.requirements.forEach(subReq => {
                  const currentSubLevel = newLevels[subReq.skill] || 0;
                  if (currentSubLevel < subReq.level) {
                    newLevels[subReq.skill] = subReq.level;
                    
                    // 또 다시 재귀적으로 체크
                    const subSkill = SKILLS.find(s => s.id === subReq.skill);
                    if (subSkill && subSkill.requirements.length > 0) {
                      autoIncrease(subSkill, subReq.level);
                    }
                  }
                });
              };
              autoIncrease(requiredSkill, requiredLevel);
            }
          }
        });
      }
      
      onSkillLevelsChange(newLevels);
    }
  };

  const decreaseSkillLevel = (skillId: string) => {
    const currentLevel = skillLevels[skillId] || 0;
    if (currentLevel > 0) {
      onSkillLevelsChange({ ...skillLevels, [skillId]: currentLevel - 1 });
    }
  };

  const resetAllSkills = () => {
    onSkillLevelsChange({});
  };

  // 현재 설정된 스킬 레벨에 따른 공식 데이터 필터링
  const getActiveSkillFormulas = (): ActiveSkillFormula[] => {
    return SKILL_FORMULAS
      .map(skillFormula => {
        const currentLevel = skillLevels[skillFormula.id] || 0;
        if (currentLevel === 0) return null;
        
        const levelData = skillFormula.levels.find(l => l.level === currentLevel);
        if (!levelData) return null;
        
        return {
          name: skillFormula.name,
          level: currentLevel,
          ...levelData
        };
      })
      .filter((item): item is ActiveSkillFormula => item !== null);
  };

  const activeFormulas = getActiveSkillFormulas();

  useEffect(() => {
    if (onActiveFormulasChange) {
      onActiveFormulasChange(activeFormulas);
    }
  }, [skillLevels, isSabangBuffActive, onActiveFormulasChange]);

  return (
    <>
      <Card className="bg-slate-700/30 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white text-lg flex justify-between items-center">
            <span>스킬 설정</span>
            <div className="flex items-center gap-4">
              <span className={`text-sm ${remainingPoints < 0 ? 'text-red-400' : 'text-purple-300'}`}>
                스킬 포인트: {remainingPoints < 0 ? '-' : ''}{Math.abs(remainingPoints)} / {availablePoints}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={resetAllSkills}
                className="bg-red-900/40 border-red-500/30 hover:bg-red-800/50 text-white text-xs"
              >
                초기화
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* 스킬트리 그리드 */}
          <div className="relative" style={{ minHeight: "600px" }}>
            {/* Row 1: 영도술 연마, 부적 연마 */}
            <div className="grid grid-cols-8 gap-2 mb-4">
              <div className="col-start-3">
                <SkillItem 
                  skill={SKILLS.find(s => s.id === "youngdo")!}
                  level={skillLevels["youngdo"] || 0}
                  canLearn={canLearnSkill(SKILLS.find(s => s.id === "youngdo")!)}
                  onIncrease={() => increaseSkillLevel("youngdo", 10)}
                  onDecrease={() => decreaseSkillLevel("youngdo")}
                />
              </div>
              <div className="col-start-6">
                <SkillItem 
                  skill={SKILLS.find(s => s.id === "bujuk")!}
                  level={skillLevels["bujuk"] || 0}
                  canLearn={canLearnSkill(SKILLS.find(s => s.id === "bujuk")!)}
                  onIncrease={() => increaseSkillLevel("bujuk", 10)}
                  onDecrease={() => decreaseSkillLevel("bujuk")}
                />
              </div>
            </div>

            {/* Row 2: 수혼일신, 수호부, 무사부 */}
            <div className="grid grid-cols-8 gap-2 mb-4">
              <div className="col-start-2">
                <SkillItem 
                  skill={SKILLS.find(s => s.id === "suhon")!}
                  level={skillLevels["suhon"] || 0}
                  canLearn={canLearnSkill(SKILLS.find(s => s.id === "suhon")!)}
                  onIncrease={() => increaseSkillLevel("suhon", 5)}
                  onDecrease={() => decreaseSkillLevel("suhon")}
                />
              </div>
              <div className="col-start-5">
                <SkillItem 
                  skill={SKILLS.find(s => s.id === "suho")!}
                  level={skillLevels["suho"] || 0}
                  canLearn={canLearnSkill(SKILLS.find(s => s.id === "suho")!)}
                  onIncrease={() => increaseSkillLevel("suho", 5)}
                  onDecrease={() => decreaseSkillLevel("suho")}
                />
              </div>
              <div className="col-start-6">
                <SkillItem 
                  skill={SKILLS.find(s => s.id === "musa")!}
                  level={skillLevels["musa"] || 0}
                  canLearn={canLearnSkill(SKILLS.find(s => s.id === "musa")!)}
                  onIncrease={() => increaseSkillLevel("musa", 5)}
                  onDecrease={() => decreaseSkillLevel("musa")}
                />
              </div>
              <div className="col-start-7">
                <SkillItem 
                  skill={SKILLS.find(s => s.id === "bubsa")!}
                  level={skillLevels["bubsa"] || 0}
                  canLearn={canLearnSkill(SKILLS.find(s => s.id === "bubsa")!)}
                  onIncrease={() => increaseSkillLevel("bubsa", 5)}
                  onDecrease={() => decreaseSkillLevel("bubsa")}
                />
              </div>
            </div>

            {/* Row 3: 사령정화, 영도부, 서낭당, 오행부 */}
            <div className="grid grid-cols-8 gap-2 mb-4">
              <div className="col-start-1">
                <SkillItem 
                  skill={SKILLS.find(s => s.id === "saryoung")!}
                  level={skillLevels["saryoung"] || 0}
                  canLearn={canLearnSkill(SKILLS.find(s => s.id === "saryoung")!)}
                  onIncrease={() => increaseSkillLevel("saryoung", 5)}
                  onDecrease={() => decreaseSkillLevel("saryoung")}
                />
              </div>
              <div className="col-start-3">
                <SkillItem 
                  skill={SKILLS.find(s => s.id === "youngdobu")!}
                  level={skillLevels["youngdobu"] || 0}
                  canLearn={canLearnSkill(SKILLS.find(s => s.id === "youngdobu")!)}
                  onIncrease={() => increaseSkillLevel("youngdobu", 5)}
                  onDecrease={() => decreaseSkillLevel("youngdobu")}
                />
              </div>
              <div className="col-start-4">
                <SkillItem 
                  skill={SKILLS.find(s => s.id === "sunang")!}
                  level={skillLevels["sunang"] || 0}
                  canLearn={canLearnSkill(SKILLS.find(s => s.id === "sunang")!)}
                  onIncrease={() => increaseSkillLevel("sunang", 5)}
                  onDecrease={() => decreaseSkillLevel("sunang")}
                />
              </div>
              <div className="col-start-7">
                <SkillItem 
                  skill={SKILLS.find(s => s.id === "ohaeng")!}
                  level={skillLevels["ohaeng"] || 0}
                  canLearn={canLearnSkill(SKILLS.find(s => s.id === "ohaeng")!)}
                  onIncrease={() => increaseSkillLevel("ohaeng", 5)}
                  onDecrease={() => decreaseSkillLevel("ohaeng")}
                />
              </div>
            </div>

            {/* Row 4: 청룡부, 백호부, 주작부, 현무부 */}
            <div className="grid grid-cols-8 gap-2 mb-4">
              <div className="col-start-2">
                <SkillItem 
                  skill={SKILLS.find(s => s.id === "chungyong")!}
                  level={skillLevels["chungyong"] || 0}
                  canLearn={canLearnSkill(SKILLS.find(s => s.id === "chungyong")!)}
                  onIncrease={() => increaseSkillLevel("chungyong", 5)}
                  onDecrease={() => decreaseSkillLevel("chungyong")}
                />
              </div>
              <div className="col-start-3">
                <SkillItem 
                  skill={SKILLS.find(s => s.id === "backho")!}
                  level={skillLevels["backho"] || 0}
                  canLearn={canLearnSkill(SKILLS.find(s => s.id === "backho")!)}
                  onIncrease={() => increaseSkillLevel("backho", 5)}
                  onDecrease={() => decreaseSkillLevel("backho")}
                />
              </div>
              <div className="col-start-4">
                <SkillItem 
                  skill={SKILLS.find(s => s.id === "jujak")!}
                  level={skillLevels["jujak"] || 0}
                  canLearn={canLearnSkill(SKILLS.find(s => s.id === "jujak")!)}
                  onIncrease={() => increaseSkillLevel("jujak", 5)}
                  onDecrease={() => decreaseSkillLevel("jujak")}
                />
              </div>
              <div className="col-start-5">
                <SkillItem 
                  skill={SKILLS.find(s => s.id === "hyunmu")!}
                  level={skillLevels["hyunmu"] || 0}
                  canLearn={canLearnSkill(SKILLS.find(s => s.id === "hyunmu")!)}
                  onIncrease={() => increaseSkillLevel("hyunmu", 5)}
                  onDecrease={() => decreaseSkillLevel("hyunmu")}
                />
              </div>
            </div>

            {/* Row 5: 사방신부 */}
            <div className="grid grid-cols-8 gap-2 mb-4">
              <div className="col-start-4">
                <SkillItem 
                  skill={SKILLS.find(s => s.id === "sabangsin")!}
                  level={skillLevels["sabangsin"] || 0}
                  canLearn={canLearnSkill(SKILLS.find(s => s.id === "sabangsin")!)}
                  onIncrease={() => increaseSkillLevel("sabangsin", 5)}
                  onDecrease={() => decreaseSkillLevel("sabangsin")}
                />
              </div>
            </div>

            {/* Row 6: 사방오행진 */}
            <div className="grid grid-cols-8 gap-2 mb-4">
              <div className="col-start-4">
                <SkillItem 
                  skill={SKILLS.find(s => s.id === "sabangohaeng")!}
                  level={skillLevels["sabangohaeng"] || 0}
                  canLearn={canLearnSkill(SKILLS.find(s => s.id === "sabangohaeng")!)}
                  onIncrease={() => increaseSkillLevel("sabangohaeng", 5)}
                  onDecrease={() => decreaseSkillLevel("sabangohaeng")}
                />
              </div>
            </div>

            {/* Row 7: 천지신령 */}
            <div className="grid grid-cols-8 gap-2 mb-4">
              <div className="col-start-7">
                <SkillItem 
                  skill={SKILLS.find(s => s.id === "chunjishin")!}
                  level={skillLevels["chunjishin"] || 0}
                  canLearn={canLearnSkill(SKILLS.find(s => s.id === "chunjishin")!)}
                  onIncrease={() => increaseSkillLevel("chunjishin", 10)}
                  onDecrease={() => decreaseSkillLevel("chunjishin")}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 활성화된 스킬 공식 표시 */}
      {activeFormulas.length > 0 && (
        <Card className="bg-slate-700/30 border-purple-500/20 mt-4">
          <CardHeader>
            <CardTitle className="text-white text-lg flex justify-between items-center">
              <span>활성화된 스킬 공식</span>
              {isSabangBuffActive && (
                <span className="text-sm text-purple-400 bg-purple-900/30 px-3 py-1 rounded border border-purple-500/30">
                  사방오행진 활성화
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm text-left text-gray-200">
              <thead className="text-xs text-purple-300 uppercase bg-gray-500/20">
                <tr>
                  <th scope="col" className="px-6 py-3">스킬 이름</th>
                  <th scope="col" className="px-6 py-3">레벨</th>
                  <th scope="col" className="px-6 py-3">공격력 (MATK)</th>
                </tr>
              </thead>
              <tbody>
                {activeFormulas.map(formula => {
                  // 부적연마와 영도술 연마 레벨 가져오기
                  const bujukLevel = skillLevels["bujuk"] || 0;
                  const youngdoLevel = skillLevels["youngdo"] || 0;
                  
                  // 사방오행진 버프가 적용되는 스킬인지 확인
                  const hasSabangBuff = formula.buffName === "사방오행진";
                  // 버프가 활성화되고 사방오행진 버프가 있는 스킬인 경우 버프 공격력 사용
                  const baseMatk = (isSabangBuffActive && hasSabangBuff) 
                    ? formula.buffMatk 
                    : formula.normalMatk;
                  
                  // 공식에 따라 추가 데미지 계산
                  let additionalMatk = 0;
                  if (formula.name === "사방오행진") {
                    // 사방오행진: (부적연마LV+영도술 연마LV)*배수
                    const multiplier = formula.level * 15; // LV1=15, LV2=30, LV3=45, LV4=60, LV5=75
                    additionalMatk = (bujukLevel + youngdoLevel) * multiplier;
                  } else if (formula.name === "사령정화") {
                    // 사령정화: (영도술 연마LV*2)*20
                    additionalMatk = (youngdoLevel * 2) * 20;
                  } else {
                    // 기타 스킬: 부적연마LV*배수
                    const multiplier = formula.level * 15; // LV1=15, LV2=30, LV3=45, LV4=60, LV5=75
                    additionalMatk = bujukLevel * multiplier;
                  }
                  
                  const totalMatk = baseMatk + additionalMatk;
                  
                  return (
                    <tr key={formula.name} className="bg-gray-800/20 border-b border-gray-700">
                      <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">
                        {formula.name}
                      </th>
                      <td className="px-6 py-4">
                        {formula.level}
                      </td>
                      <td className={`px-6 py-4 ${isSabangBuffActive && hasSabangBuff ? 'text-purple-400 font-semibold' : ''}` }>
                        {totalMatk.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </>
  );
}

interface SkillItemProps {
  skill: Skill;
  level: number;
  canLearn: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
}

function SkillItem({ skill, level, canLearn, onIncrease, onDecrease }: SkillItemProps) {
  const isMaxLevel = level >= skill.maxLevel;
  const isDisabled = !canLearn && level === 0;
  const isInactive = level === 0;

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      // 휠 위로 스크롤 = 포인트 투자
      if (!isMaxLevel) {
        onIncrease();
      }
    } else {
      // 휠 아래로 스크롤 = 포인트 회수
      if (level > 0) {
        onDecrease();
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div 
        className={`relative w-12 h-12 ${isInactive ? 'opacity-30' : ''} cursor-pointer`}
        onWheel={handleWheel}
      >
        <img 
          src={skill.icon} 
          alt={skill.name} 
          className="w-full h-full rounded border-2 border-purple-500/50"
        />
        {isInactive && (
          <div className="absolute inset-0 bg-black/60 rounded"></div>
        )}
      </div>
      
      <div className={`text-xs text-center min-w-[60px] ${isInactive ? 'text-gray-300' : 'text-white'}`}>
        {skill.name}
      </div>
      
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="outline"
          onClick={onDecrease}
          disabled={level === 0}
          className="h-5 w-5 p-0 bg-slate-700/50 border-purple-500/50 hover:bg-slate-600/50"
        >
          <Minus className="h-3 w-3 text-white" />
        </Button>
        
        <span className={`text-xs min-w-[40px] text-center ${level > 0 ? 'text-yellow-400' : 'text-gray-200'}`}>
          {level} / {skill.maxLevel}
        </span>
        
        <Button
          size="sm"
          variant="outline"
          onClick={onIncrease}
          disabled={isMaxLevel}
          className="h-5 w-5 p-0 bg-slate-700/50 border-purple-500/50 hover:bg-slate-600/50"
        >
          <Plus className="h-3 w-3 text-white" />
        </Button>
      </div>
    </div>
  );
}