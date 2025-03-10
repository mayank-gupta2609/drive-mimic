import React from "react";

export const useWindowLocation = () => {
    const [path, setPath] = React.useState(window.location.pathname);
    const listenToPopstate = () => {
        const winPath = window.location.pathname;
        setPath(winPath);
    };
    React.useEffect(() => {
        window.addEventListener("popstate", listenToPopstate);
        return () => {
            window.removeEventListener("popstate", listenToPopstate);
        };
    }, []);
    return path;
};