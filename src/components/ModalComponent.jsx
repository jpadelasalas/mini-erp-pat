import React from "react";
import CloseIcon from "@mui/icons-material/Close";

const ModalComponent = React.memo(
  ({ title, handleCloseModal, children, footer }) => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30 ">
        {/* Modal Box */}
        <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md text-sm md:text-md ">
          <header className="text-sm md:text-md lg:text-xl bg-violet-100 flex justify-between p-4 rounded-t-lg">
            <span className="font-semibold ">{title}</span>
            <CloseIcon onClick={handleCloseModal} className="cursor-pointer" />
          </header>
          {children}
          {footer}
        </div>
      </div>
    );
  }
);

export default ModalComponent;
