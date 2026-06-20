import { cloneElement, createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import useOutsideClick from "../hooks/useOutsideClick";

const modalStyle =
  "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-[3.2rem_4rem] transition-all duration-500";

const overlayStyle =
  "fixed inset-0 w-full h-screen bg-white/10 backdrop-blur-sm z-[1000] transition-all duration-500";

const buttonStyle =
  "absolute top-[1.2rem] right-[1.9rem] bg-transparent border-none p-[0.2rem] rounded-sm translate-x-[0.8rem] transition-all duration-200 hover:bg-gray-100 [&_svg]:w-[2.4rem] [&_svg]:h-[2.4rem]";

// 1. Create Context
const ModalContext = createContext();

// 2. Create Parent Component
function Modal({ children }) {
  const [openName, setOpenName] = useState("");
  const close = () => setOpenName("");
  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ open, close, openName }}>
      {children}
    </ModalContext.Provider>
  );
}

// 3. Create Children that related togther with parent.
function Open({ children, opens: opensWindowName }) {
  const { open } = useContext(ModalContext);

  // Creates a copy of a React element with new props and/or children while preserving its original identity and state.
  return cloneElement(children, { onClick: () => open(opensWindowName) });
}

function Window({ children, name }) {
  const { close, openName } = useContext(ModalContext);

  const ref = useOutsideClick(close);

  if (openName !== name) return null;

  return createPortal(
    <div className={overlayStyle}>
      <div className={modalStyle} ref={ref}>
        <button className={buttonStyle} onClick={close}>
          <HiXMark />
        </button>
        {cloneElement(children, { onCloseModal: close })}
      </div>
      ;
    </div>,
    document.body,
  );
}

// 4. Assign this children components to parent as properties.
Modal.Open = Open;
Modal.Window = Window;

export default Modal;
