import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";

type WeaponGrade = "A등급" | "B등급" | "C등급" | "D등급" | "무등급";

interface WeaponSettingsProps {
  weaponGrade: WeaponGrade;
  weaponRefine: number;
  baseWeaponDamage: number;
  onWeaponGradeChange: (grade: WeaponGrade) => void;
  onWeaponRefineChange: (refine: number) => void;
  onBaseWeaponDamageChange: (damage: number) => void;
}

export function WeaponSettings({
  weaponGrade,
  weaponRefine,
  baseWeaponDamage,
  onWeaponGradeChange,
  onWeaponRefineChange,
  onBaseWeaponDamageChange,
}: WeaponSettingsProps) {
  return (
    <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-white">무기 설정</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="magic" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="magic">마법 데미지</TabsTrigger>
            <TabsTrigger value="ranged">원거리물리(크리) 데미지</TabsTrigger>
          </TabsList>

          <TabsContent value="magic">
            {/* 라벨 행 */}
            <div className="grid grid-cols-3 gap-4 mb-2">
              <Label className="text-purple-300">무기등급</Label>
              <Label className="text-purple-300">무기제련도</Label>
              <Label className="text-purple-300">기본무기데미지</Label>
            </div>

            {/* 입력 필드 행 */}
            <div className="grid grid-cols-3 gap-4">
              {/* 무기등급 */}
              <Select value={weaponGrade} onValueChange={onWeaponGradeChange}>
                <SelectTrigger className="bg-slate-700/50 border-purple-500/50 text-white">
                  <SelectValue placeholder="무기등급 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A등급">A등급</SelectItem>
                  <SelectItem value="B등급">B등급</SelectItem>
                  <SelectItem value="C등급">C등급</SelectItem>
                  <SelectItem value="D등급">D등급</SelectItem>
                  <SelectItem value="무등급">무등급</SelectItem>
                </SelectContent>
              </Select>

              {/* 무기제련도 */}
              <Input
                type="number"
                min={0}
                max={20}
                value={weaponRefine}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value >= 0 && value <= 20) {
                    onWeaponRefineChange(value);
                  }
                }}
                className="bg-slate-700/50 border-purple-500/50 text-white"
              />

              {/* 기본무기데미지 */}
              <Input
                type="number"
                min={0}
                value={baseWeaponDamage}
                onChange={(e) => onBaseWeaponDamageChange(Number(e.target.value))}
                className="bg-slate-700/50 border-purple-500/50 text-white"
              />
            </div>
          </TabsContent>

          <TabsContent value="ranged">
            <div className="p-8 text-center text-purple-300">
              <p className="text-lg">원거리물리(크리) 데미지 설정</p>
              <p className="mt-2 text-sm">준비 중입니다.</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}