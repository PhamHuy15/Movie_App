import { createContext, useContext, useEffect, useState } from 'react';

const ModalContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useModalContext = () => {
    return useContext(ModalContext);
};

const ModalProvider = ({ children }) => {
    const [isShowing, setIsShowing] = useState(false);
    const [content, setContent] = useState();

    useEffect(() => {
        if (isShowing) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'scroll';
        }
    }, [isShowing]);

    const openPopup = (content) => {
        setIsShowing(true);
        setContent(content);
    };

    return (
        <ModalContext.Provider value={{ openPopup }}>
            {children}
            {isShowing && (
                <div className="fixed inset-0 z-50">
                    <div
                        onClick={() => setIsShowing(false)}
                        className="absolute inset-0 flex items-center justify-center bg-slate-600/60"
                    >
                        {content}
                    </div>
                </div>
            )}
        </ModalContext.Provider>
    );
};

export default ModalProvider;
