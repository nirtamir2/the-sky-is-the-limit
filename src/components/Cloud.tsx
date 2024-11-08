import {createEffect} from "solid-js";
import "./Cloud.css"
interface Props {

};

export function Cloud(props: Props) {
    let cloudBaseRef :HTMLDivElement = null!
    let cloudBackRef :HTMLDivElement = null!
    let cloudMidRef :HTMLDivElement = null!
    let cloudFrontRef :HTMLDivElement = null!

    createEffect(() => {
        const animate = () => {
            const t = Date.now() / 10000
            if (cloudBaseRef) cloudBaseRef.style.transform = `translate(${Math.sin(t) * 10}px, ${Math.cos(t) * 5}px)`
            if (cloudBackRef) cloudBackRef.style.transform = `translate(${Math.sin(t + 0.5) * 15}px, ${Math.cos(t + 0.5) * 7}px)`
            if (cloudMidRef) cloudMidRef.style.transform = `translate(${Math.sin(t + 1) * 20}px, ${Math.cos(t + 1) * 10}px)`
            if (cloudFrontRef) cloudFrontRef.style.transform = `translate(${Math.sin(t + 1.5) * 25}px, ${Math.cos(t + 1.5) * 12}px)`
            requestAnimationFrame(animate)
        }
        animate()
    }, )

    return (
        <div>
            <div ref={cloudBaseRef} class="cloud" id="cloud-base"></div>
            <div ref={cloudBackRef} class="cloud" id="cloud-back"></div>
            <div ref={cloudMidRef} class="cloud" id="cloud-mid"></div>
            <div ref={cloudFrontRef} class="cloud" id="cloud-front"></div>
            <svg width="0" height="0">
                <filter id="filter-base">
                    <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="5" seed="8517"/>
                    <feDisplacementMap in="SourceGraphic" scale="120"/>
                </filter>
                <filter id="filter-back">
                    <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="3" seed="8517"/>
                    <feDisplacementMap in="SourceGraphic" scale="120"/>
                </filter>
                <filter id="filter-mid">
                    <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="3" seed="8517"/>
                    <feDisplacementMap in="SourceGraphic" scale="120"/>
                </filter>
                <filter id="filter-front">
                    <feTurbulence type="fractalNoise" baseFrequency="0.009" numOctaves="4" seed="8517"/>
                    <feDisplacementMap in="SourceGraphic" scale="50"/>
                </filter>
            </svg>
        </div>
    );
};
