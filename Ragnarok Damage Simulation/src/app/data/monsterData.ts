export interface Monster {
  region: string;
  name: string;
  grade: string;
  lv: number;
  mhp: number;
  def: number;
  mdef: number;
  size: string;
  race: string;
  element: string;
  ratio: string;
  res: string;
  mres: string;
}

export const MONSTER_LIST: Monster[] = [
  { region: "바르문트 심층", name: "심층의 공감하는 자", grade: "보스형", lv: 262, mhp: 78695860, def: 199, mdef: 223, size: "중형", race: "천사형", element: "염속성2", ratio: "10%", res: "", mres: "" },
  { region: "바르문트 심층", name: "심층의 꼬마 파툼", grade: "보스형", lv: 263, mhp: 87700530, def: 192, mdef: 213, size: "소형", race: "인간형", element: "풍속성3", ratio: "10%", res: "", mres: "" },
  { region: "바르문트 심층", name: "심층의 드래곤 플라이", grade: "보스형", lv: 264, mhp: 83702230, def: 201, mdef: 119, size: "중형", race: "곤충형", element: "풍속성4", ratio: "10%", res: "", mres: "" },
  { region: "바르문트 심층", name: "심층의 솔져 스켈레톤", grade: "보스형", lv: 264, mhp: 100400600, def: 294, mdef: 114, size: "중형", race: "불사형", element: "불사속성3", ratio: "10%", res: "", mres: "" },
  { region: "바르문트 심층", name: "심층의 스팅", grade: "보스형", lv: 265, mhp: 101934980, def: 292, mdef: 170, size: "중형", race: "무형", element: "지속성4", ratio: "10%", res: "", mres: "" },
  { region: "바르문트 심층", name: "심층의 아놀리안", grade: "보스형", lv: 263, mhp: 107320500, def: 229, mdef: 115, size: "중형", race: "어패형", element: "수속성3", ratio: "10%", res: "", mres: "" },
  { region: "바르문트 심층", name: "심층의 아쳐 스켈레톤", grade: "보스형", lv: 264, mhp: 98579600, def: 172, mdef: 100, size: "중형", race: "불사형", element: "불사속성2", ratio: "10%", res: "", mres: "" },
  { region: "바르문트 심층", name: "심층의 용암 두꺼비", grade: "보스형", lv: 262, mhp: 102957370, def: 363, mdef: 159, size: "중형", race: "동물형", element: "화속성4", ratio: "10%", res: "", mres: "" },
  { region: "바르문트 심층", name: "심층의 우드 고블린", grade: "보스형", lv: 264, mhp: 99900999, def: 303, mdef: 177, size: "중형", race: "식물형", element: "지속성3", ratio: "10%", res: "", mres: "" },
  { region: "바르문트 심층", name: "심층의 축원하는 자", grade: "보스형", lv: 263, mhp: 89002070, def: 299, mdef: 175, size: "중형", race: "천사형", element: "염속성3", ratio: "10%", res: "", mres: "" },
  { region: "바르문트 심층", name: "심층의 캇파", grade: "보스형", lv: 263, mhp: 105899670, def: 299, mdef: 115, size: "중형", race: "어패형", element: "수속성3", ratio: "10%", res: "", mres: "" },
  { region: "바르문트 심층", name: "심층의 폼 스파이더", grade: "보스형", lv: 265, mhp: 89009870, def: 319, mdef: 123, size: "중형", race: "곤충형", element: "독속성2", ratio: "10%", res: "", mres: "" },
  { region: "바르문트 심층", name: "심층의 핀귀큘라", grade: "보스형", lv: 264, mhp: 81679820, def: 198, mdef: 222, size: "중형", race: "식물형", element: "독속성3", ratio: "10%", res: "", mres: "" },
  { region: "바르문트 심층", name: "심층의 홀리 스코글", grade: "보스형", lv: 265, mhp: 83587530, def: 187, mdef: 207, size: "중형", race: "천사형", element: "성속성2", ratio: "10%", res: "", mres: "" },
  { region: "바르문트 심층", name: "심층의 홀리 프루스", grade: "보스형", lv: 263, mhp: 85497880, def: 299, mdef: 115, size: "중형", race: "천사형", element: "성속성2", ratio: "10%", res: "", mres: "" },
  { region: "바르문트 심층", name: "심층의 화염 프릴도라", grade: "보스형", lv: 265, mhp: 93256470, def: 180, mdef: 103, size: "중형", race: "동물형", element: "화속성3", ratio: "10%", res: "", mres: "" },
  { region: "바르문트 심층 어비스", name: "심연의 나가", grade: "보스형", lv: 265, mhp: 181266750, def: 432, mdef: 167, size: "대형", race: "동물형", element: "지속성2", ratio: "10%", res: "", mres: "" },
  { region: "바르문트 심층 어비스", name: "심연의 냉동 가고일", grade: "보스형", lv: 265, mhp: 162858710, def: 255, mdef: 151, size: "중형", race: "악마형", element: "수속성3", ratio: "10%", res: "", mres: "" },
  { region: "바르문트 심층 어비스", name: "심연의 돌로가리스", grade: "보스형", lv: 265, mhp: 178600800, def: 444, mdef: 172, size: "중형", race: "어패형", element: "지속성3", ratio: "10%", res: "", mres: "" },
  { region: "바르문트 심층 어비스", name: "심연의 두네이르", grade: "보스형", lv: 265, mhp: 166986400, def: 443, mdef: 171, size: "대형", race: "인간형", element: "화속성3", ratio: "10%", res: "", mres: "" },
  { region: "바르문트 심층 어비스", name: "심연의 모로크의 현신", grade: "보스형", lv: 265, mhp: 155392230, def: 444, mdef: 172, size: "대형", race: "천사형", element: "암속성1", ratio: "10%", res: "", mres: "" },
  { region: "바르문트 심층 어비스", name: "심연의 모스킬로", grade: "보스형", lv: 265, mhp: 155812230, def: 519, mdef: 200, size: "중형", race: "곤충형", element: "풍속성3", ratio: "10%", res: "", mres: "" },
  { region: "바르문트 심층 어비스", name: "심연의 살라만다", grade: "보스형", lv: 265, mhp: 155742230, def: 480, mdef: 185, size: "대형", race: "무형", element: "화속성2", ratio: "10%", res: "", mres: "" },
  { region: "바르문트 심층 어비스", name: "심연의 어시더스", grade: "보스형", lv: 265, mhp: 171678990, def: 592, mdef: 259, size: "대형", race: "용족", element: "풍속성2", ratio: "10%", res: "", mres: "" },
  { region: "바르문트 심층 어비스", name: "심연의 에이션트 트리", grade: "보스형", lv: 265, mhp: 164463460, def: 492, mdef: 190, size: "대형", race: "식물형", element: "지속성2", ratio: "10%", res: "", mres: "" },
  { region: "바르문트 심층 어비스", name: "심연의 플레임 고스트", grade: "보스형", lv: 265, mhp: 159779165, def: 280, mdef: 314, size: "중형", race: "불사형", element: "화속성2", ratio: "10%", res: "", mres: "" },
  { region: "요르스칼프 1층", name: "각성 요르도스 심문관", grade: "보스형", lv: 253, mhp: 18679789, def: 258, mdef: 306, size: "중형", race: "악마형", element: "무속성2", ratio: "10%", res: "", mres: "" },
  { region: "요르스칼프 1층", name: "각성 요르도스 재판관", grade: "보스형", lv: 253, mhp: 17854432, def: 170, mdef: 192, size: "중형", race: "악마형", element: "암속성2", ratio: "10%", res: "", mres: "" },
  { region: "요르스칼프 1층", name: "각성 요르도스 집행자", grade: "보스형", lv: 253, mhp: 21424383, def: 284, mdef: 266, size: "중형", race: "악마형", element: "지속성2", ratio: "10%", res: "", mres: "" },
  { region: "요르스칼프 1층", name: "각성 요르미", grade: "보스형", lv: 245, mhp: 16060874, def: 158, mdef: 175, size: "중형", race: "인간형", element: "암속성2", ratio: "10%", res: "", mres: "" },
  { region: "요르스칼프 1층", name: "각성 요르미 전도사", grade: "보스형", lv: 246, mhp: 15574933, def: 237, mdef: 278, size: "중형", race: "인간형", element: "무속성2", ratio: "10%", res: "", mres: "" },
  { region: "요르스칼프 2층", name: "각성 요르도스 심문관", grade: "보스형", lv: 253, mhp: 18679789, def: 258, mdef: 306, size: "중형", race: "악마형", element: "무속성2", ratio: "10%", res: "", mres: "" },
  { region: "요르스칼프 2층", name: "각성 요르도스 재판관", grade: "보스형", lv: 253, mhp: 17854432, def: 170, mdef: 192, size: "중형", race: "악마형", element: "암속성2", ratio: "10%", res: "", mres: "" },
  { region: "요르스칼프 2층", name: "각성 요르도스 집행자", grade: "보스형", lv: 253, mhp: 21424383, def: 284, mdef: 266, size: "중형", race: "악마형", element: "지속성2", ratio: "10%", res: "", mres: "" },
  { region: "요르스칼프 2층", name: "각성 요르투스 주교", grade: "보스형", lv: 265, mhp: 26428044, def: 194, mdef: 432, size: "중형", race: "악마형", element: "암속성2", ratio: "10%", res: "", mres: "" },
  { region: "요르스칼프 2층", name: "각성 요르투스 주술사", grade: "보스형", lv: 265, mhp: 32222557, def: 306, mdef: 371, size: "중형", race: "악마형", element: "염속성1", ratio: "10%", res: "", mres: "" },
  { region: "요르스칼프 2층", name: "각성 요스코푸스 수호사", grade: "보스형", lv: 264, mhp: 42369774, def: 403, mdef: 391, size: "중형", race: "인간형", element: "풍속성2", ratio: "10%", res: "", mres: "" },
  { region: "요르스칼프 2층", name: "각성 요스코푸스 주술사", grade: "보스형", lv: 264, mhp: 36578292, def: 295, mdef: 356, size: "중형", race: "인간형", element: "염속성1", ratio: "10%", res: "", mres: "" },
  { region: "에피소드20", name: "궁극의 라스간드", grade: "보스형", lv: 215, mhp: 500000000, def: 527, mdef: 286, size: "대형", race: "불사형", element: "독속성4", ratio: "10%", res: "175", mres: "133" },
  { region: "제로셀 '녹스'", name: "M.GC-5848", grade: "보스형", lv: 272, mhp: 118473799, def: 527, mdef: 794, size: "중형", race: "악마형", element: "독속성3", ratio: "10%", res: "", mres: "" },
  { region: "제로셀 '녹스'", name: "M.GN-6059", grade: "보스형", lv: 271, mhp: 126869897, def: 534, mdef: 805, size: "중형", race: "인간형", element: "화속성4", ratio: "10%", res: "", mres: "" },
  { region: "제로셀 '녹스'", name: "M.MC-4593", grade: "보스형", lv: 272, mhp: 129371365, def: 526, mdef: 792, size: "중형", race: "인간형", element: "암속성3", ratio: "10%", res: "", mres: "" },
  { region: "제로셀 '녹스'", name: "M.MI-4419", grade: "보스형", lv: 270, mhp: 119364856, def: 316, mdef: 739, size: "중형", race: "인간형", element: "풍속성2", ratio: "10%", res: "", mres: "" },
  { region: "제로셀 '녹스'", name: "M.RG-5520", grade: "보스형", lv: 272, mhp: 145696328, def: 648, mdef: 1003, size: "중형", race: "인간형", element: "성속성2", ratio: "10%", res: "", mres: "" },
  { region: "제로셀 '녹스'", name: "M.SR-5916", grade: "보스형", lv: 271, mhp: 145889584, def: 522, mdef: 786, size: "중형", race: "인간형", element: "수속성3", ratio: "10%", res: "", mres: "" },
  { region: "제로셀 '녹스'", name: "M.WA-5598", grade: "보스형", lv: 270, mhp: 124407240, def: 555, mdef: 837, size: "중형", race: "인간형", element: "풍속성3", ratio: "10%", res: "", mres: "" },
  { region: "제로셀 '녹스'", name: "M.WL-5581", grade: "보스형", lv: 272, mhp: 111349046, def: 384, mdef: 1357, size: "중형", race: "무형", element: "염속성3", ratio: "10%", res: "", mres: "" },
  { region: "제로셀 '룩스'", name: "M.AB-4084", grade: "보스형", lv: 272, mhp: 129371365, def: 526, mdef: 792, size: "중형", race: "인간형", element: "성속성3", ratio: "10%", res: "", mres: "" },
  { region: "제로셀 '룩스'", name: "M.GC.D-4402", grade: "보스형", lv: 272, mhp: 118476711, def: 540, mdef: 815, size: "중형", race: "악마형", element: "암속성4", ratio: "10%", res: "", mres: "" },
  { region: "제로셀 '룩스'", name: "M.MC.M-5407", grade: "보스형", lv: 271, mhp: 145889584, def: 522, mdef: 786, size: "중형", race: "인간형", element: "수속성3", ratio: "10%", res: "", mres: "" },
  { region: "제로셀 '룩스'", name: "M.MI.D-5794", grade: "보스형", lv: 270, mhp: 136834190, def: 517, mdef: 779, size: "중형", race: "인간형", element: "지속성4", ratio: "10%", res: "", mres: "" },
  { region: "제로셀 '룩스'", name: "M.RA-4152", grade: "보스형", lv: 271, mhp: 121732891, def: 318, mdef: 746, size: "중형", race: "인간형", element: "풍속성4", ratio: "10%", res: "", mres: "" },
  { region: "제로셀 '룩스'", name: "M.RK-4480", grade: "보스형", lv: 272, mhp: 129374115, def: 539, mdef: 812, size: "중형", race: "인간형", element: "화속성2", ratio: "10%", res: "", mres: "" },
  { region: "제로셀 '룩스'", name: "M.SC-3941", grade: "보스형", lv: 270, mhp: 113920556, def: 518, mdef: 780, size: "중형", race: "악마형", element: "독속성3", ratio: "10%", res: "", mres: "" },
  { region: "제로셀 '룩스'", name: "M.SO-4206", grade: "보스형", lv: 272, mhp: 111349046, def: 384, mdef: 1357, size: "중형", race: "무형", element: "염속성2", ratio: "10%", res: "", mres: "" },
  { region: "제로셀 '비타'", name: "M.AB-0001", grade: "보스형", lv: 283, mhp: 516650486, def: 736, mdef: 1144, size: "중형", race: "인간형", element: "성속성4", ratio: "10%", res: "", mres: "" },
  { region: "제로셀 '비타'", name: "M.GC.D-0001", grade: "보스형", lv: 283, mhp: 473146930, def: 726, mdef: 1181, size: "중형", race: "악마형", element: "암속성4", ratio: "10%", res: "", mres: "" },
  { region: "제로셀 '비타'", name: "M.MC.M-0001", grade: "보스형", lv: 282, mhp: 583204061, def: 732, mdef: 1134, size: "중형", race: "인간형", element: "수속성3", ratio: "10%", res: "", mres: "" },
  { region: "제로셀 '비타'", name: "M.MI.D-0001", grade: "보스형", lv: 281, mhp: 547567506, def: 726, mdef: 1124, size: "중형", race: "인간형", element: "지속성4", ratio: "10%", res: "", mres: "" },
  { region: "제로셀 '비타'", name: "M.RA-0001", grade: "보스형", lv: 282, mhp: 486634384, def: 437, mdef: 1091, size: "중형", race: "인간형", element: "풍속성4", ratio: "10%", res: "", mres: "" },
  { region: "제로셀 '비타'", name: "M.RK-0001", grade: "보스형", lv: 283, mhp: 516663215, def: 760, mdef: 1177, size: "중형", race: "인간형", element: "화속성3", ratio: "10%", res: "", mres: "" },
  { region: "제로셀 '비타'", name: "M.SC-0001", grade: "보스형", lv: 281, mhp: 455879766, def: 727, mdef: 1126, size: "중형", race: "악마형", element: "독속성4", ratio: "10%", res: "", mres: "" },
  { region: "제로셀 '비타'", name: "M.SO-0001", grade: "보스형", lv: 283, mhp: 444691488, def: 548, mdef: 2038, size: "중형", race: "무형", element: "염속성3", ratio: "10%", res: "", mres: "" },
  { region: "제로셀 '아크'", name: "M.GC-0001", grade: "보스형", lv: 283, mhp: 473133453, def: 740, mdef: 1146, size: "중형", race: "악마형", element: "독속성4", ratio: "10%", res: "", mres: "" },
  { region: "제로셀 '아크'", name: "M.GN-0001", grade: "보스형", lv: 282, mhp: 263651342, def: 753, mdef: 1166, size: "중형", race: "인간형", element: "화속성4", ratio: "10%", res: "", mres: "" },
  { region: "제로셀 '아크'", name: "M.MC-0001", grade: "보스형", lv: 283, mhp: 516650486, def: 739, mdef: 1144, size: "중형", race: "인간형", element: "암속성4", ratio: "10%", res: "", mres: "" },
  { region: "제로셀 '아크'", name: "M.MI-0001", grade: "보스형", lv: 281, mhp: 477657968, def: 433, mdef: 1081, size: "중형", race: "인간형", element: "수속성3", ratio: "10%", res: "", mres: "" },
  { region: "제로셀 '아크'", name: "M.RG-0001", grade: "보스형", lv: 283, mhp: 173473468, def: 917, mdef: 1461, size: "중형", race: "인간형", element: "성속성3", ratio: "10%", res: "", mres: "" },
  { region: "제로셀 '아크'", name: "M.SR-0001", grade: "보스형", lv: 282, mhp: 583204061, def: 732, mdef: 1134, size: "중형", race: "인간형", element: "수속성4", ratio: "10%", res: "", mres: "" },
  { region: "제로셀 '아크'", name: "M.WA-0001", grade: "보스형", lv: 281, mhp: 497846677, def: 787, mdef: 1219, size: "중형", race: "무형", element: "풍속성4", ratio: "10%", res: "", mres: "" },
  { region: "제로셀 '아크'", name: "M.WL-0001", grade: "보스형", lv: 283, mhp: 444691488, def: 548, mdef: 2038, size: "중형", race: "무형", element: "염속성4", ratio: "10%", res: "", mres: "" },
  { region: "성좌의 탑", name: "베텔기우스", grade: "보스형", lv: 250, mhp: 2000000000, def: 346, mdef: 102, size: "대형", race: "용족", element: "무속성2", ratio: "10%", res: "500", mres: "500" },
  { region: "에피소드21", name: "잠식당한 탄", grade: "보스형", lv: 240, mhp: 570000000, def: 383, mdef: 147, size: "대형", race: "인간형", element: "독속성4", ratio: "10%", res: "", mres: "" },
];
