import "./Modal.css";

export const Modal = ({ children, isVisible }: { children: React.ReactNode, isVisible: boolean }) => {
    return (
        isVisible && <div className="modal-backdrop shadow">
            <div className="modal shadow">
                {children}
            </div>
        </div>
   );
}