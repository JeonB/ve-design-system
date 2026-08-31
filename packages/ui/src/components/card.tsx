import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../utils/cn";
import {
  cardBody,
  cardDescription,
  cardFooter,
  cardHeader,
  cardRoot,
  cardTitle,
  type CardPadding,
  type CardVariant
} from "./card.css";

export type { CardPadding, CardVariant };

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
  padding?: CardPadding;
  fullWidth?: boolean;
  children: ReactNode;
};

/**
 * 표면 컨테이너. 배경·보더·그림자는 color/shadow 테마 토큰만 사용한다.
 *
 * @example
 * <Card>
 *   <Card.Header>
 *     <Card.Title>Profile</Card.Title>
 *     <Card.Description>Account details</Card.Description>
 *   </Card.Header>
 *   <Card.Body>…</Card.Body>
 *   <Card.Footer>…</Card.Footer>
 * </Card>
 */
function CardRoot({
  variant = "elevated",
  padding = "md",
  fullWidth = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      {...props}
      className={cn(cardRoot({ variant, padding, fullWidth }), className)}
      data-padding={padding}
      data-slot="card"
      data-variant={variant}
    >
      {children}
    </div>
  );
}

export type CardHeaderProps = HTMLAttributes<HTMLDivElement>;

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return <div {...props} className={cn(cardHeader, className)} data-slot="card-header" />;
}

export type CardTitleProps = HTMLAttributes<HTMLHeadingElement>;

export function CardTitle({ className, ...props }: CardTitleProps) {
  return <h3 {...props} className={cn(cardTitle, className)} data-slot="card-title" />;
}

export type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return <p {...props} className={cn(cardDescription, className)} data-slot="card-description" />;
}

export type CardBodyProps = HTMLAttributes<HTMLDivElement>;

export function CardBody({ className, ...props }: CardBodyProps) {
  return <div {...props} className={cn(cardBody, className)} data-slot="card-body" />;
}

export type CardFooterProps = HTMLAttributes<HTMLDivElement>;

export function CardFooter({ className, ...props }: CardFooterProps) {
  return <div {...props} className={cn(cardFooter, className)} data-slot="card-footer" />;
}

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Body: CardBody,
  Footer: CardFooter
});
