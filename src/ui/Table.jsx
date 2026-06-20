function Table({ columns, data, renderRow }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-100">
          {columns.map((col) => (
            <th
              key={col}
              className="px-6 py-4 whitespace-nowrap text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide"
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="divide-y divide-slate-50">{data.map(renderRow)}</tbody>
    </table>
  );
}

export default Table;
