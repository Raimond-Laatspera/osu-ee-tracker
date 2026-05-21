type ButtonProps = {
  label: string;
  onClick: () => void;
  className?: string;
};

function Button({ label, onClick, className }: ButtonProps) {
  return (
    <button type="button" onClick={onClick} className={className}>
      {label}
    </button>
  );
}

export default Button;