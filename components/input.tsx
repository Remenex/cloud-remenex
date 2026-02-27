type Props = {
  placeholder: string;
  value?: string;
  type?: string;
  required: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Input({
  placeholder,
  value,
  type = "text",
  required,
  onChange,
}: Props) {
  return (
    <input
      className="w-full border border-border px-3 py-3 rounded-xl"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
    />
  );
}
