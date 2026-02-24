// 버프별 증가 수치 정의
export interface BuffBonus {
  INT?: number;
  DEX?: number;
  LUK?: number;
  SPL?: number;
  MATK?: number;
  'MATK %'?: number;
  SMATK?: number;
  general?: number;
  boss?: number;
  allSize?: number;
  small?: number;
  medium?: number;
  large?: number;
  allElement?: number;
  neutral?: number;
  water?: number;
  earth?: number;
  fire?: number;
  wind?: number;
  poison?: number;
  holy?: number;
  shadow?: number;
  ghost?: number;
  undead?: number;
  allRace?: number;
  plant?: number;
  undeadRace?: number;
  formless?: number;
  angel?: number;
  dragon?: number;
  fish?: number;
  insect?: number;
  brute?: number;
  demon?: number;
  demiHuman?: number;
  allMagic?: number;
  earthMagic?: number;
  windMagic?: number;
  waterMagic?: number;
  fireMagic?: number;
  ghostMagic?: number;
  shadowMagic?: number;
  holyMagic?: number;
  neutralMagic?: number;
  poisonMagic?: number;
  undeadMagic?: number;
}

export const BUFF_BONUSES: Record<string, BuffBonus> = {
  // 버프스킬
  "법사부": {
    SMATK: 10
  },
  "오행부": {
    neutral: 20,
    water: 20,
    earth: 20,
    fire: 20,
    wind: 20
  },
  "사방오행진": {
    SMATK: 25
  },
  "천지신령": {
    allMagic: 25
  },
  "콤페턴티아": {
    SMATK: 50
  },
  "저녁노을": {
    SMATK: 15
  },
  
  // 루나포마
  "공격력": {
    'MATK %': 10
  },
  "용족/식물": {
    plant: 15,
    dragon: 15
  },
  "악마/불사": {
    undeadRace: 15,
    demon: 15
  },
  "무형/어패": {
    formless: 15,
    fish: 15
  },
  "동물/천사": {
    brute: 15,
    angel: 15
  },
  "인간/곤충": {
    demiHuman: 15,
    insect: 15
  },
  
  // 캐쉬아이템
  "올마이티": {
    INT: 10,
    DEX: 10,
    LUK: 10
  },
  "파워부스터": {
    MATK: 30,
    'MATK %': 1
  },
  "인피니티 드링크": {
    allMagic: 5
  },
  "마법력 증폭": {
    'MATK %': 50
  }
};

// 선택된 버프들로부터 총 보너스 계산
export function calculateTotalBuffBonus(selectedBuffs: {
  skills: string[];
  lunaforma: string[];
  cashItems: string[];
}): BuffBonus {
  const totalBonus: BuffBonus = {};
  
  // 모든 선택된 버프를 합침
  const allSelectedBuffs = [
    ...selectedBuffs.skills,
    ...selectedBuffs.lunaforma,
    ...selectedBuffs.cashItems
  ];
  
  console.log('=== 버프 보너스 계산 ===');
  console.log('선택된 버프들:', allSelectedBuffs);
  
  // 각 버프의 보너스를 합산
  allSelectedBuffs.forEach(buffName => {
    const buffBonus = BUFF_BONUSES[buffName];
    console.log(`버프 "${buffName}":`, buffBonus);
    if (buffBonus) {
      Object.entries(buffBonus).forEach(([key, value]) => {
        const typedKey = key as keyof BuffBonus;
        if (totalBonus[typedKey] === undefined) {
          totalBonus[typedKey] = value;
        } else {
          totalBonus[typedKey] = (totalBonus[typedKey] as number) + value;
        }
      });
    }
  });
  
  console.log('총 버프 보너스:', totalBonus);
  console.log('SMATK 합계:', totalBonus.SMATK);
  
  return totalBonus;
}