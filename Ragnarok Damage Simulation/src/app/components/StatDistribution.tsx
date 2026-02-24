import { Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { getTotalStatCost, getNextStatCost } from "../utils/pointCalculator";
import { BuffBonus } from "../utils/buffCalculator";

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

interface StatDistributionProps {
  stats: Stats;
  onStatsChange: (stats: Stats) => void;
  statBonus: StatBonus;
  onStatBonusChange: (statBonus: StatBonus) => void;
  availablePoints: number;
  buffBonus: BuffBonus;
}

const STAT_NAMES = {
  STR: "STR",
  AGI: "AGI",
  VIT: "VIT",
  INT: "INT",
  DEX: "DEX",
  LUK: "LUK",
} as const;

export function StatDistribution({ stats, onStatsChange, statBonus, onStatBonusChange, availablePoints, buffBonus }: StatDistributionProps) {
  // 사용된 포인트 계산
  const usedPoints = Object.values(stats).reduce((total, statValue) => {
    return total + getTotalStatCost(statValue);
  }, 0);

  const remainingPoints = availablePoints - usedPoints;

  const handleStatIncrease = (statName: keyof Stats) => {
    const currentValue = stats[statName];
    if (currentValue >= 130) return;

    onStatsChange({
      ...stats,
      [statName]: currentValue + 1,
    });
  };

  const handleStatDecrease = (statName: keyof Stats) => {
    const currentValue = stats[statName];
    if (currentValue <= 1) return;

    onStatsChange({
      ...stats,
      [statName]: currentValue - 1,
    });
  };

  const handleStatInputChange = (statName: keyof Stats, value: string) => {
    const numValue = parseInt(value) || 1;
    const clampedValue = Math.max(1, Math.min(130, numValue));
    
    onStatsChange({
      ...stats,
      [statName]: clampedValue,
    });
  };

  const handleBonusChange = (statName: keyof StatBonus, value: string) => {
    const numValue = parseInt(value) || 0;
    const clampedValue = Math.max(0, numValue);
    
    onStatBonusChange({
      ...statBonus,
      [statName]: clampedValue,
    });
  };

  const handleReset = () => {
    onStatsChange({
      STR: 1,
      AGI: 1,
      VIT: 1,
      INT: 1,
      DEX: 1,
      LUK: 1,
    });
    onStatBonusChange({
      STR: 0,
      AGI: 0,
      VIT: 0,
      INT: 0,
      DEX: 0,
      LUK: 0,
    });
  };

  return (
    <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-base">스탯 분배</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="bg-slate-700/50 border-purple-500/30 hover:bg-slate-600/50 text-white text-xs"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            초기화
          </Button>
        </div>
        <div className="flex justify-end gap-6 mt-4 text-white text-sm">
          <div>
            <span className="text-purple-300">보유포인트</span> <span className="font-bold">{availablePoints}</span>
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
        <div className="grid grid-cols-[100px_1fr_100px_100px] gap-2 pb-1 border-b border-slate-600/30">
          <div className="text-xs font-semibold text-purple-300 text-center">스탯</div>
          <div className="text-xs font-semibold text-purple-300 text-center">기본 스탯</div>
          <div className="text-xs font-semibold text-purple-300 text-center">가중치</div>
          <div className="text-xs font-semibold text-purple-300 text-center">총 합계</div>
        </div>

        {Object.entries(stats).map(([statName, statValue]) => {
          const key = statName as keyof Stats;
          const canIncrease = statValue < 130;
          const canDecrease = statValue > 1;
          const totalStat = statValue + statBonus[key] + (buffBonus[key] || 0);

          return (
            <div
              key={statName}
              className="grid grid-cols-[100px_1fr_100px_100px] gap-2 items-center p-2 bg-slate-700/30 rounded-lg border border-slate-600/30"
            >
              <div>
                <p className="font-semibold text-white text-sm text-center">{STAT_NAMES[key]}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleStatDecrease(key)}
                  disabled={!canDecrease}
                  className="h-7 w-7 bg-slate-700/50 border-purple-500/30 hover:bg-slate-600/50 text-white disabled:opacity-30"
                >
                  <Minus className="h-3 w-3" />
                </Button>

                <Input
                  type="number"
                  value={statValue}
                  onChange={(e) => handleStatInputChange(key, e.target.value)}
                  onFocus={(e) => e.target.select()}
                  min={1}
                  max={130}
                  className="text-center bg-slate-900/40 border-purple-500/30 text-white text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none h-7"
                />

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleStatIncrease(key)}
                  disabled={!canIncrease}
                  className="h-7 w-7 bg-slate-700/50 border-purple-500/30 hover:bg-slate-600/50 text-white disabled:opacity-30"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              <div>
                <Input
                  type="number"
                  value={statBonus[key]}
                  onChange={(e) => handleBonusChange(key, e.target.value)}
                  onFocus={(e) => e.target.select()}
                  min={0}
                  placeholder="0"
                  className="text-center bg-slate-900/40 border-purple-500/30 text-white text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none h-7"
                />
              </div>

              <div className="text-center">
                <p className="text-lg font-bold text-cyan-400">{totalStat}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}