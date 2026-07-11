import { spinnerStyles, type SpinnerSize } from "./button.css";

type ButtonSpinnerProps = {
  size?: SpinnerSize;
};

/** 버튼 로딩 상태용 순수 장식 스피너. 스크린 리더에서는 숨긴다. */
export function ButtonSpinner({ size = "md" }: ButtonSpinnerProps) {
  return (
    <span aria-hidden="true" className={spinnerStyles({ size })} role="presentation" />
  );
}
