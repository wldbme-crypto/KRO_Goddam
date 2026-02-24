import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export interface ClassData {
  name: string;
  type: 1 | 2; // 1: 전승직업군, 2: 확장직업군
}

const CLASSES: ClassData[] = [
  // 전승직업군
  { name: "드래곤나이트", type: 1 },
  { name: "임페리얼가드", type: 1 },
  { name: "아크메이지", type: 1 },
  { name: "엘레멘탈마스터", type: 1 },
  { name: "마이스터", type: 1 },
  { name: "바이올로", type: 1 },
  { name: "카디날", type: 1 },
  { name: "인퀴지터", type: 1 },
  { name: "쉐도우크로스", type: 1 },
  { name: "어비스체이서", type: 1 },
  { name: "윈드호크", type: 1 },
  { name: "트루바두르", type: 1 },
  { name: "트루베르", type: 1 },
  // 확장직업군
  { name: "천제", type: 2 },
  { name: "영도사", type: 2 },
  { name: "신키로", type: 2 },
  { name: "시라누이", type: 2 },
  { name: "나이트워치", type: 2 },
  { name: "하이퍼노비스", type: 2 },
  { name: "혼령사", type: 2 },
  { name: "알리테아", type: 2 },
];

interface ClassSelectorProps {
  selectedClass: string;
  onClassChange: (className: string) => void;
}

export function ClassSelector({ selectedClass, onClassChange }: ClassSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="class-select" className="text-purple-300 text-xs">직업 선택</Label>
      <Select value={selectedClass} onValueChange={onClassChange}>
        <SelectTrigger id="class-select" className="w-full bg-slate-700/50 border-purple-500/30 text-white text-sm">
          <SelectValue placeholder="직업을 선택하세요" />
        </SelectTrigger>
        <SelectContent className="bg-slate-800 border-purple-500/30">
          {CLASSES.map((classData) => (
            <SelectItem key={classData.name} value={classData.name} className="text-white text-sm focus:bg-slate-700 focus:text-white">
              {classData.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// 직업명으로 직업 타입을 찾는 헬퍼 함수
export function getClassType(className: string): 1 | 2 | undefined {
  const classData = CLASSES.find(c => c.name === className);
  return classData?.type;
}

export { CLASSES };