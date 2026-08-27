import { colorContract } from "./color-theme.css";
import { staticVars } from "./static.css";

/**
 * 컴포넌트 공개 토큰 진입점.
 * color/shadow는 theme contract, 나머지는 static :root 토큰이다.
 */
export const vars = {
  color: colorContract.color,
  shadow: colorContract.shadow,
  space: staticVars.space,
  radius: staticVars.radius,
  font: staticVars.font,
  component: staticVars.component,
  size: staticVars.size,
  motion: staticVars.motion,
  effect: staticVars.effect,
  opacity: staticVars.opacity,
  focus: staticVars.focus,
  zIndex: staticVars.zIndex,
  layout: staticVars.layout
};
