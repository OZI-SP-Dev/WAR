import { useEffect } from "react";

export const useOutsideClickDetect = (ref: any, handleClickOutside: () => void): void => {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClick(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target)) {
                handleClickOutside();
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClick);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClick);
        }; // eslint-disable-next-line
    }, [ref]);
}