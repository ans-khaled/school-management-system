import DetailsSectionsHeader from "../../../ui/DetailsSectionsHeader";

const PRIMARY_COLOR = {
  bg: "bg-blue-500",
  light: "bg-blue-50",
  text: "text-blue-500",
};

function TeacherDetailsCard({ title, cardItemsList }) {
  return (
    <div className="mb-4  gap-3">
      <DetailsSectionsHeader>{title}</DetailsSectionsHeader>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {cardItemsList.map((item) => (
          <div
            key={item.label}
            className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4"
          >
            <div
              className={`w-10 h-10 rounded-xl ${PRIMARY_COLOR.light} ${PRIMARY_COLOR.text} flex items-center justify-center text-lg`}
            >
              {item.icon}
            </div>
            <div>
              <p className="text-slate-400 text-[11px] font-medium uppercase tracking-wide">
                {item.label}
              </p>
              <p className="text-slate-800 font-semibold text-sm mt-0.5">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeacherDetailsCard;
