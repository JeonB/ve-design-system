import { spinnerStyles, type SpinnerSize } from "./button.css";

type ButtonSpinnerProps = {
  size?: SpinnerSize;
};

export function ButtonSpinner({ size = "md" }: ButtonSpinnerProps) {
  return (
    <span aria-hidden="true" className={spinnerStyles({ size })} role="presentation" />
  );
}
