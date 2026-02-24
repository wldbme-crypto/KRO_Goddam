import { MONSTER_LIST } from "../data/monsterData";

export interface MonsterData {
  name: string;
  size: string;
  element: string;
  race: string;
  level: number;
  grade: string;
  mhp: number;
  mres: number;
}

interface MonsterInfoProps {
  onSelectMonster: (monster: MonsterData) => void;
}

export function MonsterInfo({ onSelectMonster }: MonsterInfoProps) {
  return (
    <div className="overflow-x-auto">
      <div className="mb-4">
        <p className="text-purple-200 text-sm">
          💡 몬스터를 클릭하면 몬스터 설정에 자동으로 입력됩니다.
        </p>
      </div>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-600">
            <th className="px-3 py-2 text-left text-xs font-semibold text-purple-300">지역</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-purple-300">몹이름</th>
            <th className="px-3 py-2 text-center text-xs font-semibold text-purple-300">등급</th>
            <th className="px-3 py-2 text-center text-xs font-semibold text-purple-300">LV</th>
            <th className="px-3 py-2 text-right text-xs font-semibold text-purple-300">MHP</th>
            <th className="px-3 py-2 text-center text-xs font-semibold text-purple-300">DEF</th>
            <th className="px-3 py-2 text-center text-xs font-semibold text-purple-300">MDEF</th>
            <th className="px-3 py-2 text-center text-xs font-semibold text-purple-300">크기</th>
            <th className="px-3 py-2 text-center text-xs font-semibold text-purple-300">종족</th>
            <th className="px-3 py-2 text-center text-xs font-semibold text-purple-300">속성</th>
            <th className="px-3 py-2 text-center text-xs font-semibold text-purple-300">비율</th>
            <th className="px-3 py-2 text-center text-xs font-semibold text-purple-300">RES</th>
            <th className="px-3 py-2 text-center text-xs font-semibold text-purple-300">MRES</th>
          </tr>
        </thead>
        <tbody>
          {MONSTER_LIST.map((monster, idx) => (
            <tr 
              key={idx} 
              className={`border-b border-slate-700/50 cursor-pointer hover:bg-purple-900/30 transition-colors ${idx % 2 === 0 ? 'bg-slate-700/20' : 'bg-slate-700/10'}`}
              onClick={() => {
                onSelectMonster({
                  name: monster.name,
                  size: monster.size,
                  element: monster.element,
                  race: monster.race,
                  level: monster.lv,
                  grade: monster.grade,
                  mhp: monster.mhp,
                  mres: monster.mres,
                });
              }}
            >
              <td className="px-3 py-2 text-xs text-purple-200">{monster.region}</td>
              <td className="px-3 py-2 text-xs text-white">{monster.name}</td>
              <td className="px-3 py-2 text-center text-xs text-white">{monster.grade}</td>
              <td className="px-3 py-2 text-center text-xs text-white">{monster.lv}</td>
              <td className="px-3 py-2 text-right text-xs text-cyan-400">{monster.mhp.toLocaleString()}</td>
              <td className="px-3 py-2 text-center text-xs text-white">{monster.def}</td>
              <td className="px-3 py-2 text-center text-xs text-white">{monster.mdef}</td>
              <td className="px-3 py-2 text-center text-xs text-white">{monster.size}</td>
              <td className="px-3 py-2 text-center text-xs text-white">{monster.race}</td>
              <td className="px-3 py-2 text-center text-xs text-green-400">{monster.element}</td>
              <td className="px-3 py-2 text-center text-xs text-white">{monster.ratio}</td>
              <td className="px-3 py-2 text-center text-xs text-white">{monster.res}</td>
              <td className="px-3 py-2 text-center text-xs text-white">{monster.mres}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}