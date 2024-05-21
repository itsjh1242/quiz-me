import { cn } from "../../utils/cn";
import { DEFAULT_COLOR } from "../../utils/default";

interface BadgeInterface {
  className?: string;
  children: React.ReactNode;
  text_color?: string;
  bg_color?: string;
}

export const Badge = (props: BadgeInterface) => {
  const { className, children, text_color, bg_color } = props;
  return (
    <div className={cn(`px-3 py-1 rounded-md ${bg_color || DEFAULT_COLOR.bg_color} ${text_color || DEFAULT_COLOR.text_color}`, className)}>{children}</div>
  );
};
