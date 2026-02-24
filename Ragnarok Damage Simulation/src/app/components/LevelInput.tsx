import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";

interface LevelInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  pointLabel?: string;
  pointValue?: number;
  secondaryPointLabel?: string;
  secondaryPointValue?: number;
}

export function LevelInput({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  pointLabel, 
  pointValue,
  secondaryPointLabel,
  secondaryPointValue
}: LevelInputProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // 빈 문자열인 경우 처리
    if (newValue === "") {
      onChange(min);
      return;
    }

    const numValue = parseInt(newValue, 10);
    
    // 유효한 숫자인지 확인
    if (!isNaN(numValue)) {
      // 범위 내의 값으로 제한
      const clampedValue = Math.min(Math.max(numValue, min), max);
      onChange(clampedValue);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={`level-${label}`} className="text-purple-300 text-xs">{label}</Label>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          disabled={value <= min}
          className="h-10 w-10 bg-slate-700/50 border-purple-500/30 hover:bg-slate-600/50 text-white disabled:opacity-50"
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <Input
          id={`level-${label}`}
          type="number"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          className="text-center bg-slate-700/50 border-purple-500/30 text-white text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleIncrement}
          disabled={value >= max}
          className="h-10 w-10 bg-slate-700/50 border-purple-500/30 hover:bg-slate-600/50 text-white disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center justify-between">
        
        <div className="flex gap-2">
          {pointLabel && pointValue !== undefined && (
            <div className="px-3 py-1 bg-purple-900/40 rounded-md border border-purple-500/30">
              <p className="text-[10px] text-purple-200">
                {pointLabel}: <span className="text-white font-semibold">{pointValue}</span>
              </p>
            </div>
          )}
          {secondaryPointLabel && secondaryPointValue !== undefined && secondaryPointValue > 0 && (
            <div className="px-3 py-1 bg-amber-900/40 rounded-md border border-amber-500/30">
              <p className="text-[10px] text-amber-200">
                {secondaryPointLabel}: <span className="text-white font-semibold">{secondaryPointValue}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}