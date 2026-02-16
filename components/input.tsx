type Props = {
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Input({ placeholder, value, onChange }: Props) {
  return (
    <input
      className="w-full border border-border px-3 py-3 rounded-xl"
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}
