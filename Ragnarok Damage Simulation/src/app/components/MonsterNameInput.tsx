import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { MONSTER_LIST } from "../data/monsterData";
import { Label } from "./ui/label";

interface MonsterNameInputProps {
  value: string;
  onChange: (name: string, monsterData?: {
    size: string;
    element: string;
    race: string;
    level: number;
    grade: string;
    mhp: number;
  }) => void;
}

export function MonsterNameInput({ value, onChange }: MonsterNameInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredMonsters = MONSTER_LIST.filter((monster) =>
    monster.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  const handleSelectMonster = (monsterName: string) => {
    const monster = MONSTER_LIST.find((m) => m.name === monsterName);
    if (monster) {
      setSearchTerm(monsterName);
      onChange(monsterName, {
        size: monster.size,
        element: monster.element,
        race: monster.race,
        level: monster.lv,
        grade: monster.grade,
        mhp: monster.mhp,
      });
      setIsOpen(false);
    }
  };

  return (
    <div className="space-y-2" ref={containerRef}>
      <Label htmlFor="monster-name" className="text-purple-300 text-xs">몬스터 이름</Label>
      <div className="relative">
        <input
          ref={inputRef}
          id="monster-name"
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          className="w-full px-3 py-2 bg-slate-700/50 border border-purple-500/30 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 pr-10"
          placeholder="몬스터 이름 입력 또는 검색"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-300 hover:text-purple-100"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
        
        {isOpen && filteredMonsters.length > 0 && (
          <div className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto bg-slate-800 border border-purple-500/30 rounded shadow-lg">
            {filteredMonsters.map((monster, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectMonster(monster.name)}
                className="px-3 py-2 hover:bg-purple-900/50 cursor-pointer text-white text-xs border-b border-slate-700/50 last:border-b-0"
              >
                <div className="flex justify-between items-center">
                  <span>{monster.name}</span>
                  <span className="text-[10px] text-purple-300">{monster.region}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {isOpen && filteredMonsters.length === 0 && searchTerm && (
          <div className="absolute z-50 w-full mt-1 bg-slate-800 border border-purple-500/30 rounded shadow-lg px-3 py-2">
            <p className="text-purple-300 text-xs">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}