import { Cloud } from "~/components/Cloud";
import type { JSXElement } from "solid-js";
import { createSignal } from "solid-js";

/**
 * Easing function for smooth animation (Ease Out Cubic)
 * @param {number} t - Current time progress (0 to 1)
 * @returns {number} - Eased progress
 */
function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

const maxDisplacementScale = 2000; // Maximum displacement scale for the effect

function getOpacity(progress: number) {
  if (progress < 0.5) {
    return 1;
  } else {
    const opacityProgress = (progress - 0.5) / 0.5;
    return 1 - opacityProgress;
  }
}

function SVGFilterEffect(props: {
  seed: number;
  scale: number;
  ref: HTMLDivElement;
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
            overflow="visible"
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
        ref={props.ref}
        style={{
          width: "100%",
          height: "100%",
          "object-fit": "cover",
          filter: "url(#dissolve-filter)",
          "-webkit-filter": "url(#dissolve-filter)",
          transform: "scale(1)",
          opacity: "1",
          "border-radius": "24px",
        }}
      >
        {props.children}
      </div>
    </>
  );
}

export default function Component() {
  const [text, setText] = createSignal("");

  let displayedImage: HTMLDivElement = null!;
  const [isAnimating, setIsAnimating] = createSignal(false);
  const [displacementMapScale, setDisplacementMapScale] = createSignal(0);
  const [bigNoiseSeed, setBigNoiseSeed] = createSignal<number>(0);

  /**
   * Displays the next image in the array with reset styles
   */
  function showNextImage() {
    // displayedImage.src = images[currentIndex];

    displayedImage.style.display = "block";
    displayedImage.style.transform = "scale(1)";
    displayedImage.style.opacity = "1";
    setDisplacementMapScale(0);
  }

  return (
    <div>
      <Cloud />
      <div class="p-10">
        <input
          type="text"
          class="border"
          value={text()}
          onInput={(e) => {
            return setText(e.target.value);
          }}
        />
        <SVGFilterEffect
          ref={displayedImage}
          seed={bigNoiseSeed()}
          scale={displacementMapScale()}
        >
          {text()}
        </SVGFilterEffect>

        <div>
          <button
            type="button"
            class="bg-white p-2"
            onClick={() => {
              /**
               * Handles the delete button click event to trigger the dissolve animation
               */
              // Prevent animation if already animating or image is hidden
              if (isAnimating() || displayedImage.style.display === "none")
                return;
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
                displayedImage.style.transform = `scale(${scaleFactor})`;

                // Adjust image opacity to create a fading effect
                displayedImage.style.opacity = getOpacity(progress);

                if (progress < 1) {
                  // Continue the animation
                  requestAnimationFrame(animate);
                } else {
                  // Reset styles and show the next image after animation completes
                  setTimeout(() => {
                    displayedImage.style.display = "none";
                    displayedImage.style.transform = "scale(1)";
                    displayedImage.style.opacity = "1";
                    setDisplacementMapScale(0);
                    setIsAnimating(false);
                    showNextImage();
                  }, 0);
                }
              }

              // Start the animation
              requestAnimationFrame(animate);

              // Initialize the first image display
              // displayedImage.src = images[currentIndex];
              displayedImage.style.display = "block";
            }}
          >
            Do
          </button>
        </div>
      </div>
    </div>
  );
}
