import Button from "./Button";
import { useAuth } from "../contexts/AuthContext";

function ConfirmLogout({ onCloseModal }) {
  const { logout } = useAuth();

  return (
    <div className="w-[30rem] flex flex-col gap-4">
      <h3 className="text-[1.5rem] font-semibold">
        Are you sure want to logout ?
      </h3>

      <div className="flex justify-end gap-[1.2rem]">
        <Button variation="secondary" onClick={onCloseModal}>
          Cancel
        </Button>
        <Button
          variation="danger"
          onClick={() => {
            logout();
            onCloseModal?.();
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}

export default ConfirmLogout;
