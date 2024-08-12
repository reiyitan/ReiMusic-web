import "./Modal.css";

export const Modal = ({ children, isVisible, header }: { children: React.ReactNode, isVisible: boolean, header: string }) => {
    return (
        isVisible && <div className="modal-backdrop shadow">
            <div className="modal shadow">
                {header && <h2 className="overflow-ellipsis">{header}</h2>}
                {children}
            </div>
        </div>
   );
}