import { FiFileText, FiMail, FiPhone, FiUser } from "react-icons/fi";
import BackButton from "../../../ui/BackButton";
import Spinner from "../../../ui/Spinner";
import Error from "../../../ui/Error";
import ItemNotFound from "../../../ui/ItemNotFound";
import DetailsSectionsHeader from "../../../ui/DetailsSectionsHeader";
import ParentDetailsCards from "./ParentDetailsCards";
import useBackTitle from "../../../hooks/useBackTitle";
import useGetItem from "../../../hooks/useGetItem";
import LinkedStudentsList from "./LinkedStudentsList";
import AssignButton from "../../../ui/AssignButton";
import Modal from "../../../ui/Modal";
// import AssignStudentToParentForm from "./AssignStudentToParentForm";

function ParentDetails() {
  const { isLoading, item: parent, error } = useGetItem("parents");
  const backTitle = useBackTitle("Parents");

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  if (!parent) return <ItemNotFound item="parent" />;

  const {
    id,
    parent_id,
    address,
    phone,
    occupation,
    students,
    user = {},
  } = parent;
  const { name, email } = user;

  return (
    <div className="flex-1 p-10 overflow-y-auto">
      <BackButton title={backTitle} />

      <div className={`bg-orange-500 rounded-2xl p-8 mb-6 text-white`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/70 text-sm font-medium mb-1">
              {occupation ?? "Parent"}
            </p>
            <h1 className="text-3xl font-bold mb-2">{name}</h1>
            <p className="text-white/80 text-sm">{email}</p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-bold">
            {name?.[0]?.toUpperCase() ?? "?"}
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div>
        <DetailsSectionsHeader>Basic information</DetailsSectionsHeader>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: <FiUser />, label: "Full Name", value: name },
            { icon: <FiMail />, label: "Email", value: email },
            { icon: <FiPhone />, label: "Phone", value: phone ?? "—" },
            {
              icon: <FiFileText />,
              label: "Parent ID",
              value: parent_id ?? "—",
            },
            {
              icon: <FiFileText />,
              label: "Occupation",
              value: occupation ?? "—",
            },
            {
              icon: <FiFileText />,
              label: "Address",
              value: address ?? "—",
            },
          ].map((item) => (
            <ParentDetailsCards key={item.label} item={item} />
          ))}
        </div>
      </div>

      {/* Students Information */}
      <div>
        <div className="flex items-center justify-between my-4">
          <DetailsSectionsHeader>Linked Students</DetailsSectionsHeader>

          <Modal>
            <Modal.Open opens="assign-student-to-parent">
              <AssignButton title="Student" />
            </Modal.Open>
            <Modal.Window name="assign-student-to-parent">
              {/* <AssignStudentToParentForm studentID={id} /> */}
            </Modal.Window>
          </Modal>
        </div>
        {students.length === 0 ? (
          <div className="text-sm text-amber-600 bg-amber-50 px-4 py-3 rounded-xl mb-4">
            ⚠️ No students linked to this parent yet.
          </div>
        ) : (
          <LinkedStudentsList students={students} />
        )}
      </div>
    </div>
  );
}

export default ParentDetails;
