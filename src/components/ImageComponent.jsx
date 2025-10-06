import React, { useState } from 'react';
import { useEffect } from 'react';

const ImageComponent = ({ src, width, height, className }) => {
    const [currentSrc, setCurrentSrc] = useState(
        `https://placehold.co/${width}x${height}/EEE/31343C?font=open-sans&text=Loading`,
    );

    useEffect(() => {
        const img = new Image();

        if (src) {
            img.src = src;
            img.onload = () => {
                setCurrentSrc(src);
            };
            return;
        }

        setCurrentSrc(
            // `https://placehold.co/${width}x${height}/EEE/31343C?font=open-sans&text=No Image`,
            '/actorNoImage.jpg',
        );
        return () => (img.onload = null);
    }, [src, width, height]);

    return (
        <img
            src={currentSrc}
            className={
                currentSrc === src || !src ? className : `${className} blur-md`
            }
            width={width}
            height={height}
        />
    );
};

export default ImageComponent;
