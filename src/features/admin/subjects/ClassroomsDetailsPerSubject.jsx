import { Clock, Users } from "lucide-react";
import Button from "../../../ui/Button";
import Modal from "../../../ui/Modal";
import ConfirmDelete from "../../../ui/ConfirmDelete";
import AssignUpdateSubjectForm from "./AssignUpdateSubjectForm";
import ViewButton from "../../../ui/ViewButton";
import useClassMutations from "../classes/useClassMutations";
import DetailsSectionsHeader from "../../../ui/DetailsSectionsHeader";

function ClassroomsDetailsPerSubject({
  classrooms,
  maxWeeklyHours,
  subjectId,
}) {
  const { removeSubject, isRemovingSubject } = useClassMutations();

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-3">
        <DetailsSectionsHeader>Enrolled Classrooms</DetailsSectionsHeader>
        <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full border border-gray-200">
          {classrooms.length} classrooms
        </span>
      </div>

      {classrooms.length === 0 ? (
        <div className="text-center py-11 text-slate-400 text-md">
          No classrooms found.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {classrooms.map((cls) => {
            const hrs = cls.pivot?.weekly_hours ?? 0;
            const pct =
              maxWeeklyHours > 0 ? Math.round((hrs / maxWeeklyHours) * 100) : 0;
            return (
              <div
                key={cls.id}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-0.5">
                      {cls.name}
                    </p>
                    <p className="text-xs text-gray-400 mb-3">
                      {cls.grade_level} · {cls.academic_year}
                    </p>
                  </div>
                  <div>
                    <ViewButton
                      category="classes"
                      id={cls.id}
                      backFrom="Subject Details"
                      title="Classroom"
                    />
                  </div>
                </div>
                <div className="space-y-2 border-t border-gray-100 pt-2">
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center gap-1 text-gray-400">
                      <Users size={12} /> Capacity
                    </span>
                    <span className="font-medium text-gray-700">
                      {cls.capacity} students
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center gap-1 text-gray-400">
                      <Clock size={12} /> Weekly hrs
                    </span>
                    <span className="font-medium text-gray-700">{hrs} hrs</span>
                  </div>
                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-violet-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="mt-5 flex flex-row-reverse gap-3">
                  <Modal>
                    <Modal.Open
                      opens={`update-classroom-weekly-hours-${cls.id}`}
                    >
                      <Button variation="secondary" size="small">
                        Update weekly hours
                      </Button>
                    </Modal.Open>

                    <Modal.Window
                      name={`update-classroom-weekly-hours-${cls.id}`}
                    >
                      <AssignUpdateSubjectForm
                        editSession={true}
                        classroom={cls}
                        subjectId={subjectId}
                      />
                    </Modal.Window>

                    <Modal.Open opens={`delete-classroom-${cls.id}`}>
                      <Button variation="danger" size="small">
                        delete
                      </Button>
                    </Modal.Open>

                    <Modal.Window name={`delete-classroom-${cls.id}`}>
                      <ConfirmDelete
                        resourceName="Classroom"
                        itemName={cls.name}
                        disabled={isRemovingSubject}
                        onConfirm={() =>
                          removeSubject({
                            classroom_id: cls.id,
                            subject_id: Number(subjectId),
                          })
                        }
                      />
                    </Modal.Window>
                  </Modal>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ClassroomsDetailsPerSubject;
