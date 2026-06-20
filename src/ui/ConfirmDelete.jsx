import Button from "./Button";

const titleType = {
  delete: "Delete",
  remove: "Remove",
};

function ConfirmDelete({
  type = "delete",
  resourceName,
  itemName,
  onConfirm,
  disabled,
  onCloseModal,
}) {
  function handleDelete() {
    onConfirm?.();
    onCloseModal?.();
  }

  return (
    <div className="w-[40rem] flex flex-col">
      <h3 className="text-[1.5rem] font-semibold">
        {titleType[type]} '{itemName}' {resourceName}
      </h3>
      <p className="text-gray-500 mb-[1.2rem]">
        Are you sure you want to{" "}
        <span className="font-bold">{titleType[type]} </span>
        this {resourceName} permanently?
        {type === "delete" ? " This action cannot be undone." : ""}
      </p>

      <div className="flex justify-end gap-[1.2rem]">
        <Button
          variation="secondary"
          disabled={disabled}
          onClick={onCloseModal}
        >
          Cancel
        </Button>
        <Button variation="danger" disabled={disabled} onClick={handleDelete}>
          {titleType[type]}
        </Button>
      </div>
    </div>
  );
}

export default ConfirmDelete;
