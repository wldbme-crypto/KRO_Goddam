import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { CheckSquare, Square } from "lucide-react";

interface BuffSettingsProps {
  selectedBuffs: {
    skills: string[];
    lunaforma: string[];
    cashItems: string[];
  };
  onBuffsChange: (buffs: {
    skills: string[];
    lunaforma: string[];
    cashItems: string[];
  }) => void;
}

const BUFF_SKILLS = [
  "법사부",
  "오행부",
  "사방오행진",
  "천지신령",
  "콤페턴티아",
  "저녁노을"
];

const LUNAFORMA_BUFFS = [
  "공격력",
  "용족/식물",
  "악마/불사",
  "무형/어패",
  "동물/천사",
  "인간/곤충"
];

const CASH_ITEMS = [
  "올마이티",
  "파워부스터",
  "인피니티 드링크",
  "마법력 증폭"
];

export function BuffSettings({ selectedBuffs, onBuffsChange }: BuffSettingsProps) {
  const handleSkillToggle = (skill: string) => {
    const newSkills = selectedBuffs.skills.includes(skill)
      ? selectedBuffs.skills.filter(s => s !== skill)
      : [...selectedBuffs.skills, skill];
    
    onBuffsChange({
      ...selectedBuffs,
      skills: newSkills
    });
  };

  const handleLunaformaToggle = (buff: string) => {
    const newLunaforma = selectedBuffs.lunaforma.includes(buff)
      ? selectedBuffs.lunaforma.filter(b => b !== buff)
      : [...selectedBuffs.lunaforma, buff];
    
    onBuffsChange({
      ...selectedBuffs,
      lunaforma: newLunaforma
    });
  };

  const handleCashItemToggle = (item: string) => {
    const newCashItems = selectedBuffs.cashItems.includes(item)
      ? selectedBuffs.cashItems.filter(i => i !== item)
      : [...selectedBuffs.cashItems, item];
    
    onBuffsChange({
      ...selectedBuffs,
      cashItems: newCashItems
    });
  };

  const handleToggleAll = () => {
    const totalBuffs = BUFF_SKILLS.length + LUNAFORMA_BUFFS.length + CASH_ITEMS.length;
    const selectedCount = selectedBuffs.skills.length + selectedBuffs.lunaforma.length + selectedBuffs.cashItems.length;
    
    // 모든 버프가 선택되어 있으면 전체 해제, 아니면 전체 선택
    if (selectedCount === totalBuffs) {
      onBuffsChange({
        skills: [],
        lunaforma: [],
        cashItems: []
      });
    } else {
      onBuffsChange({
        skills: [...BUFF_SKILLS],
        lunaforma: [...LUNAFORMA_BUFFS],
        cashItems: [...CASH_ITEMS]
      });
    }
  };

  const totalBuffs = BUFF_SKILLS.length + LUNAFORMA_BUFFS.length + CASH_ITEMS.length;
  const selectedCount = selectedBuffs.skills.length + selectedBuffs.lunaforma.length + selectedBuffs.cashItems.length;
  const isAllSelected = selectedCount === totalBuffs;

  return (
    <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">버프 설정</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleToggleAll}
          className="gap-2"
        >
          {isAllSelected ? (
            <>
              <CheckSquare className="h-4 w-4" />
              전체 해제
            </>
          ) : (
            <>
              <Square className="h-4 w-4" />
              전체 선택
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 버프스킬 */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-purple-300 border-b border-purple-500/30 pb-2">버프스킬</h3>
          <div className="flex flex-wrap gap-2">
            {BUFF_SKILLS.map((skill) => {
              const isSelected = selectedBuffs.skills.includes(skill);
              return (
                <Button
                  key={skill}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSkillToggle(skill)}
                  className={isSelected 
                    ? "bg-purple-600 hover:bg-purple-700 text-white border-purple-500" 
                    : "bg-slate-700/50 hover:bg-slate-600/50 text-white border-purple-500/30"}
                >
                  {skill}
                </Button>
              );
            })}
          </div>
        </div>

        {/* 루나포마 */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-purple-300 border-b border-purple-500/30 pb-2">루나포마</h3>
          <div className="flex flex-wrap gap-2">
            {LUNAFORMA_BUFFS.map((buff) => {
              const isSelected = selectedBuffs.lunaforma.includes(buff);
              return (
                <Button
                  key={buff}
                  onClick={() => handleLunaformaToggle(buff)}
                  variant={isSelected ? "default" : "outline"}
                  className={isSelected 
                    ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-500" 
                    : "bg-slate-700/50 hover:bg-slate-600/50 text-white border-blue-500/30"}
                >
                  {buff}
                </Button>
              );
            })}
          </div>
        </div>

        {/* 캐쉬아이템 */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-purple-300 border-b border-purple-500/30 pb-2">캐쉬아이템</h3>
          <div className="flex flex-wrap gap-2">
            {CASH_ITEMS.map((item) => {
              const isSelected = selectedBuffs.cashItems.includes(item);
              return (
                <Button
                  key={item}
                  onClick={() => handleCashItemToggle(item)}
                  variant={isSelected ? "default" : "outline"}
                  className={isSelected 
                    ? "bg-amber-600 hover:bg-amber-700 text-white border-amber-500" 
                    : "bg-slate-700/50 hover:bg-slate-600/50 text-white border-amber-500/30"}
                >
                  {item}
                </Button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}