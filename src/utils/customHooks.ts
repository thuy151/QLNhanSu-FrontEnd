import {useLocation} from "react-router-dom";
import qs from "query-string";
import React, { useEffect, useRef } from "react";

export const useQuery = () => {
    const { search } = useLocation();

    return {
        query: new URLSearchParams(search),
        params: qs.parse(search),
        search
    };
};

export const useWindowSize = () => {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = React.useState({
        width: 1920,
        height: 1080,
    });

    React.useEffect(() => {
        // Handler to call on window resize
        function handleResize() {
            // Set window width/height to state
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }
        // Add event listener
        window.addEventListener("resize", handleResize);
        // Call handler right away so state gets updated with initial window size
        handleResize();
        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
}

export const useInterval = (callback:any, delay:any) => {
    const savedCallback = React.useRef();

    // Remember the latest callback.
    React.useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    React.useEffect(() => {
        function tick() {
            // @ts-ignore
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

/* eslint-disable */
export const useEffectAsync = (effect:any, deps:any) => {
    // const dispatch = useDispatch();
    const ref = useRef();
    useEffect(() => {
        effect()
            .then((result:any) => ref.current = result)
            .catch((error:any) => console.log(error.message));
            // .catch((error:any) => dispatch(errorsActions.push(error.message)));
            
        return () => {
            const result:any = ref.current;
            if (result) {
                result();
            }
        };
    }, [...deps]);
};