import type { JSX , JSXElement} from "solid-js";
import { createSignal } from "solid-js";

/**
 * Easing function for smooth animation (Ease Out Cubic)
 * @param {number} t - Current time progress (0 to 1)
 * @returns {number} - Eased progress
 */
export function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

export const maxDisplacementScale = 2000; // Maximum displacement scale for the effect
export function getOpacity(progress: number) {
  if (progress < 0.5) {
    return 1;
  } else {
    const opacityProgress = (progress - 0.5) / 0.5;
    return 1 - opacityProgress;
  }
}

export function SVGFilterEffect(props: {
  style: JSX.CSSProperties;
  seed: number;
  scale: number;
  children: JSXElement;
}) {
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/*Define 'dissolve-filter' to create the dissolve effect.*/}
          {/*Enlarged filter area to prevent clipping.*/}
          <filter
            id="dissolve-filter"
            x="-200%"
            y="-200%"
            width="500%"
            height="500%"
            color-interpolation-filters="sRGB"
            // overflow="visible"
          >
            {/*Generate large-scale fractal noise*/}
            <feTurbulence
              seed={props.seed}
              type="fractalNoise"
              baseFrequency="0.004"
              numOctaves="1"
              result="bigNoise"
            />

            {/*Enhance noise contrast */}
            <feComponentTransfer in="bigNoise" result="bigNoiseAdjusted">
              <feFuncR type="linear" slope="3" intercept="-1" />
              <feFuncG type="linear" slope="3" intercept="-1" />
            </feComponentTransfer>

            {/*Generate fine-grained fractal noise -->*/}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="1"
              numOctaves="1"
              result="fineNoise"
            />

            {/*Merge the adjusted big noise and fine noise -->*/}
            <feMerge result="mergedNoise">
              <feMergeNode in="bigNoiseAdjusted" />
              <feMergeNode in="fineNoise" />
            </feMerge>

            {/*Apply displacement map to distort the image -->*/}
            <feDisplacementMap
              in="SourceGraphic"
              in2="mergedNoise"
              scale={props.scale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <div
        style={{
          width: "100%",
          height: "100%",
          "object-fit": "cover",
          filter: "url(#dissolve-filter)",
          "-webkit-filter": "url(#dissolve-filter)",
          "border-radius": "24px",
          ...props.style,
          //
        }}
      >
        {props.children}
      </div>
    </>
  );
}

export function useSVGFilterEffect() {
  const [isAnimating, setIsAnimating] = createSignal(false);
  const [displacementMapScale, setDisplacementMapScale] = createSignal(100);
  const [bigNoiseSeed, setBigNoiseSeed] = createSignal<number>(1000);
  const [style, setStyle] = createSignal<JSX.CSSProperties>({
    display: "block",
    transform: "scale(1)",
    opacity: "1",
  });

  function handleEffect() {
    // Prevent animation if already animating or image is hidden
    if (isAnimating() || style().display === "none") {
      return;
    }
    setIsAnimating(true);

    // eslint-disable-next-line sonarjs/pseudo-random
    setBigNoiseSeed(Math.floor(Math.random() * 1000)); // Vary the noise pattern

    const duration = 1000; // Animation duration in milliseconds
    const startTime = performance.now(); // Record the start time

    /**
     * Animation loop using requestAnimationFrame for smooth updates
     * @param {number} currentTime - The current time in milliseconds
     */
    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1); // Clamp progress between 0 and 1
      const easedProgress = easeOutCubic(progress); // Apply easing

      // Calculate and apply displacement scale based on eased progress
      const displacementScale = easedProgress * maxDisplacementScale;
      setDisplacementMapScale(displacementScale);

      // Slightly scale the image for a dynamic effect
      const scaleFactor = 1 + 0.1 * easedProgress;
      setStyle((s) => ({
        ...s,
        transform: `scale(${scaleFactor})`,
        opacity: `${getOpacity(progress)}`,
      }));

      // Adjust image opacity to create a fading effect

      if (progress < 1) {
        // Continue the animation
        requestAnimationFrame(animate);
      } else {
        // Reset styles and show the next image after animation completes
        setTimeout(() => {
          // eslint-disable-next-line sonarjs/no-nested-functions
          setStyle((s) => {
            return {
              ...s,
              display: "none",
              transform: "scale(1)",
              opacity: "1",
            };
          });
          setDisplacementMapScale(0);
          setIsAnimating(false);
          // displayedImage.src = images[currentIndex];

          // eslint-disable-next-line sonarjs/no-nested-functions
          setStyle((s) => {
            return {
              ...s,
              display: "block",
              transform: "scale(1)",
              opacity: "1",
            };
          });

          setDisplacementMapScale(0);
        }, 0);
      }
    }

    // Start the animation
    requestAnimationFrame(animate);

    // Initialize the first image display
    // displayedImage.src = images[currentIndex];
    setStyle((s) => ({
      ...s,
      display: "block",
    }));
  }

  return [
    { style, displacementMapScale, bigNoiseSeed } as const,
    handleEffect,
  ] as const;
}
