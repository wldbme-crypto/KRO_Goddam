export function ElementTable() {
  // Helper function to get color class based on value
  const getColorClass = (value: number): string => {
    if (value === 0) return "text-red-500";
    if (value >= 125) return "text-green-400";
    if (value < 100) return "text-orange-400";
    return "text-slate-400";
  };

  const elementData = [
    // 무속성 1-4
    { name: "무속성1", values: [100, 100, 100, 100, 100, 100, 100, 100, 90, 100] },
    { name: "무속성2", values: [100, 100, 100, 100, 100, 100, 100, 100, 70, 100] },
    { name: "무속성3", values: [100, 100, 100, 100, 100, 100, 100, 100, 50, 100] },
    { name: "무속성4", values: [100, 100, 100, 100, 100, 100, 100, 100, 0, 100] },
    // 수속성 1-4
    { name: "수속성1", values: [100, 25, 100, 90, 150, 150, 100, 100, 100, 100] },
    { name: "수속성2", values: [100, 0, 100, 80, 175, 150, 100, 100, 100, 100] },
    { name: "수속성3", values: [100, 0, 100, 70, 200, 125, 100, 100, 100, 100] },
    { name: "수속성4", values: [100, 0, 100, 60, 200, 125, 100, 100, 100, 100] },
    // 풍속성 1-4
    { name: "풍속성1", values: [100, 90, 150, 100, 25, 150, 100, 100, 100, 100] },
    { name: "풍속성2", values: [100, 80, 175, 100, 0, 150, 100, 100, 100, 100] },
    { name: "풍속성3", values: [100, 70, 200, 100, 0, 125, 100, 100, 100, 100] },
    { name: "풍속성4", values: [100, 60, 200, 100, 0, 125, 100, 100, 100, 100] },
    // 지속성 1-4
    { name: "지속성1", values: [100, 100, 25, 150, 90, 150, 100, 100, 100, 100] },
    { name: "지속성2", values: [100, 100, 0, 175, 80, 150, 100, 100, 100, 100] },
    { name: "지속성3", values: [100, 100, 0, 200, 70, 125, 100, 100, 100, 100] },
    { name: "지속성4", values: [100, 100, 0, 200, 60, 125, 100, 100, 100, 100] },
    // 화속성 1-4
    { name: "화속성1", values: [100, 150, 90, 25, 100, 150, 100, 100, 100, 90] },
    { name: "화속성2", values: [100, 175, 80, 0, 100, 150, 100, 100, 100, 80] },
    { name: "화속성3", values: [100, 200, 70, 0, 100, 125, 100, 100, 100, 70] },
    { name: "화속성4", values: [100, 200, 60, 0, 100, 125, 100, 100, 100, 60] },
    // 암속성 1-4
    { name: "암속성1", values: [100, 100, 100, 100, 100, 75, 125, 0, 90, 0] },
    { name: "암속성2", values: [100, 100, 100, 100, 100, 75, 150, 0, 80, 0] },
    { name: "암속성3", values: [100, 100, 100, 100, 100, 50, 175, 0, 70, 0] },
    { name: "암속성4", values: [100, 100, 100, 100, 100, 50, 200, 0, 60, 0] },
    // 염속성 1-4
    { name: "염속성1", values: [90, 100, 100, 100, 100, 75, 100, 100, 125, 100] },
    { name: "염속성2", values: [70, 100, 100, 100, 100, 75, 100, 100, 150, 125] },
    { name: "염속성3", values: [50, 100, 100, 100, 100, 50, 100, 100, 175, 150] },
    { name: "염속성4", values: [0, 100, 100, 100, 100, 50, 100, 100, 200, 175] },
    // 성속성 1-4
    { name: "성속성1", values: [100, 100, 100, 100, 100, 75, 0, 125, 90, 125] },
    { name: "성속성2", values: [100, 100, 100, 100, 100, 75, 0, 150, 80, 150] },
    { name: "성속성3", values: [100, 100, 100, 100, 100, 50, 0, 175, 70, 175] },
    { name: "성속성4", values: [100, 100, 100, 100, 100, 50, 0, 200, 60, 200] },
    // 불사속성 1-4
    { name: "불사속성1", values: [100, 100, 100, 125, 100, 75, 125, 0, 100, 0] },
    { name: "불사속성2", values: [100, 100, 100, 150, 100, 50, 150, 0, 125, 0] },
    { name: "불사속성3", values: [100, 100, 100, 175, 100, 25, 175, 0, 150, 0] },
    { name: "불사속성4", values: [100, 100, 100, 200, 100, 0, 200, 0, 175, 0] },
    // 독속성 1-4
    { name: "독속성1", values: [100, 150, 150, 150, 150, 0, 75, 75, 75, 75] },
    { name: "독속성2", values: [100, 150, 150, 150, 150, 0, 75, 75, 75, 50] },
    { name: "독속성3", values: [100, 125, 125, 125, 125, 0, 50, 50, 50, 25] },
    { name: "독속성4", values: [100, 125, 125, 125, 125, 0, 50, 50, 50, 0] },
  ];

  const headers = ["무", "수", "지", "화", "풍", "독", "성", "암", "염", "불사"];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="border-b border-purple-500/30">
            <th className="px-2 py-2 text-left text-xs font-medium text-purple-300">
              방어↓ 공격→
            </th>
            {headers.map((header) => (
              <th
                key={header}
                className="px-2 py-2 text-center text-xs font-medium text-purple-300"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {elementData.map((row, index) => (
            <tr
              key={row.name}
              className={`${
                index !== elementData.length - 1
                  ? "border-b border-slate-700/30"
                  : ""
              } hover:bg-slate-700/20`}
            >
              <td className="px-2 py-1.5 text-xs text-white font-medium">
                {row.name}
              </td>
              {row.values.map((value, colIndex) => (
                <td
                  key={colIndex}
                  className={`px-2 py-1.5 text-center text-xs ${getColorClass(
                    value
                  )}`}
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3 text-xs text-slate-400">
        <p>• 녹색: 강함 (125~200) / 주황색: 약함 (25~90) / 빨강: 무효 (0)</p>
      </div>
    </div>
  );
}