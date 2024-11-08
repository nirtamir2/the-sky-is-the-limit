import { Cloud } from "~/components/Cloud";
import { createSignal } from "solid-js";
import {
  SVGFilterEffect,
  useSVGFilterEffect,
} from "../components/SVGFilterEffect";
import { CloudyText } from "../components/CloudyText";

export default function Component() {
  const [text, setText] = createSignal(
    "Ipsum et ea in sint est enim esse ut fugiat. Nostrud sunt mollit esse nisi officia ex quis magna incididunt velit excepteur. Velit incididunt quis culpa reprehenderit excepteur deserunt ipsum labore consequat non est sunt irure. Anim ea labore aliqua cillum et commodo amet do Lorem.",
  );

  const [{ style, displacementMapScale, bigNoiseSeed }, handleEffect] =
    useSVGFilterEffect();

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
          style={style()}
          seed={bigNoiseSeed()}
          scale={displacementMapScale()}
        >
          <CloudyText>{text()}</CloudyText>
          {/*<img src="https://i.ibb.co/2sxT6jZ/Retro-80s-Human-Flying-Poster-cropped.jpg"/>*/}
        </SVGFilterEffect>

        <div>
          <button type="button" class="bg-white p-2" onClick={handleEffect}>
            Do
          </button>
        </div>
      </div>
    </div>
  );
}
