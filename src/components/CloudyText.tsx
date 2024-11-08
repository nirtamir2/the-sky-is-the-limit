import "./CloudyText.css";

interface Props {
  children: string;
}

export function CloudyText(props: Props) {
  return (
    <>
      <svg width="0" height="0">
        <filter id="cloud">
          {/*Create a blurry, cloud-like effect -->*/}

          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.009"
            numOctaves="4"
            seed="8517"
          />
          <feDisplacementMap in="SourceGraphic" scale="10" />
        </filter>
      </svg>

      <div class="cloudy-text">{props.children}</div>
    </>
  );
}
