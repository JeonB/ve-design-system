import { buttonStyles } from "./button.css";

export function Button({
  variant,
  size,
  type = "button",
  className,
  ...props
}) {
  const classes = [buttonStyles({ variant, size }), className]
    .filter(Boolean)
    .join(" ");

  return <button {...props} className={classes} type={type} />;
}
