import { visuallyHidden } from "./visually-hidden.css";

export function VisuallyHidden({ as: Component = "span", className, ...props }) {
  return <Component {...props} className={[visuallyHidden, className].filter(Boolean).join(" ")} />;
}
