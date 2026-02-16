type Props = {
  text: string;
  type?: "button" | "submit" | "reset";
  style?: string;
  startIcon?: React.ReactNode;
  onClick?: () => void;
};

export default function Button(props: Props) {
  return (
    <button
      className={
        "flex items-center justify-center gap-2 w-full cursor-pointer border border-border px-3 py-3 rounded-xl bg-foreground text-background font-bold " +
        props.style
      }
      type={props.type ?? "button"}
      onClick={props.onClick}
    >
      {props.startIcon}
      {props.text}
    </button>
  );
}
