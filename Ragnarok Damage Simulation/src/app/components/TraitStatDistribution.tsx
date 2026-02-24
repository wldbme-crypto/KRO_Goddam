import { Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

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

interface TraitStatDistributionProps {
  traitStats: TraitStats;
  onTraitStatsChange: (traitStats: TraitStats) => void;
  traitStatBonus: TraitStatBonus;
  onTraitStatBonusChange: (traitStatBonus: TraitStatBonus) => void;
  availablePoints: number;
}

const TRAIT_STAT_NAMES = {
  POW: "POW",
  STA: "STA",
  WIS: "WIS",
  SPL: "SPL",
  CON: "CON",
  CRT: "CRT",
} as const;

export function TraitStatDistribution({ 
  traitStats, 
  onTraitStatsChange, 
  traitStatBonus, 
  onTraitStatBonusChange, 
  availablePoints 
}: TraitStatDistributionProps) {
  // 사용된 포인트 계산 (특성스탯은 1:1)
  const usedPoints = Object.values(traitStats).reduce((total, statValue) => {
    return total + statValue;
  }, 0);

  const remainingPoints = availablePoints - usedPoints;

  const handleStatIncrease = (statName: keyof TraitStats) => {
    const currentValue = traitStats[statName];
    if (currentValue >= 110) return;

    onTraitStatsChange({
      ...traitStats,
      [statName]: currentValue + 1,
    });
  };

  const handleStatDecrease = (statName: keyof TraitStats) => {
    const currentValue = traitStats[statName];
    if (currentValue <= 0) return;

    onTraitStatsChange({
      ...traitStats,
      [statName]: currentValue - 1,
    });
  };

  const handleStatInputChange = (statName: keyof TraitStats, value: string) => {
    const numValue = parseInt(value) || 0;
    const clampedValue = Math.max(0, Math.min(110, numValue));
    
    onTraitStatsChange({
      ...traitStats,
      [statName]: clampedValue,
    });
  };

  const handleBonusChange = (statName: keyof TraitStatBonus, value: string) => {
    const numValue = parseInt(value) || 0;
    const clampedValue = Math.max(0, numValue);
    
    onTraitStatBonusChange({
      ...traitStatBonus,
      [statName]: clampedValue,
    });
  };

  const handleReset = () => {
    onTraitStatsChange({
      POW: 0,
      STA: 0,
      WIS: 0,
      SPL: 0,
      CON: 0,
      CRT: 0,
    });
    onTraitStatBonusChange({
      POW: 0,
      STA: 0,
      WIS: 0,
      SPL: 0,
      CON: 0,
      CRT: 0,
    });
  };

  return (
    <Card className="bg-slate-800/50 border-amber-500/30 backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-base">특성스탯 분배</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="bg-slate-700/50 border-amber-500/30 hover:bg-slate-600/50 text-white text-xs"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            초기화
          </Button>
        </div>
        <div className="flex justify-end gap-6 mt-4 text-white text-sm">
          <div>
            <span className="text-amber-300">보유포인트</span> <span className="font-bold">{availablePoints}</span>
          </div>
          <div>
            <span className={remainingPoints < 0 ? 'text-red-300' : 'text-green-300'}>남은 포인트</span> <span className={`font-bold ${remainingPoints < 0 ? 'text-red-400' : 'text-white'}`}>{remainingPoints}</span>
          </div>
          <div>
            <span className="text-blue-300">사용 포인트</span> <span className="font-bold">{usedPoints}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-[120px_1fr_100px_100px] gap-2 pb-1 border-b border-slate-600/30">
          <div className="text-xs font-semibold text-amber-300 text-center">특성스탯</div>
          <div className="text-xs font-semibold text-amber-300 text-center">기본 스탯</div>
          <div className="text-xs font-semibold text-amber-300 text-center">가중치</div>
          <div className="text-xs font-semibold text-amber-300 text-center">총 합계</div>
        </div>

        {Object.entries(traitStats).map(([statName, statValue]) => {
          const key = statName as keyof TraitStats;
          const canIncrease = statValue < 110;
          const canDecrease = statValue > 0;
          const totalStat = statValue + traitStatBonus[key];

          return (
            <div
              key={statName}
              className="grid grid-cols-[120px_1fr_100px_100px] gap-2 items-center p-2 bg-slate-700/30 rounded-lg border border-slate-600/30"
            >
              <div>
                <p className="font-semibold text-white text-sm text-center">{TRAIT_STAT_NAMES[key]}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleStatDecrease(key)}
                  disabled={!canDecrease}
                  className="h-7 w-7 bg-slate-700/50 border-amber-500/30 hover:bg-slate-600/50 text-white disabled:opacity-30"
                >
                  <Minus className="h-3 w-3" />
                </Button>

                <Input
                  type="number"
                  value={statValue}
                  onChange={(e) => handleStatInputChange(key, e.target.value)}
                  onFocus={(e) => e.target.select()}
                  min={0}
                  max={110}
                  className="text-center bg-slate-900/40 border-amber-500/30 text-white text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none h-7"
                />

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleStatIncrease(key)}
                  disabled={!canIncrease}
                  className="h-7 w-7 bg-slate-700/50 border-amber-500/30 hover:bg-slate-600/50 text-white disabled:opacity-30"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              <div>
                <Input
                  type="number"
                  value={traitStatBonus[key]}
                  onChange={(e) => handleBonusChange(key, e.target.value)}
                  onFocus={(e) => e.target.select()}
                  min={0}
                  placeholder="0"
                  className="text-center bg-slate-900/40 border-amber-500/30 text-white text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none h-7"
                />
              </div>

              <div className="text-center">
                <p className="text-lg font-bold text-amber-400">{totalStat}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}