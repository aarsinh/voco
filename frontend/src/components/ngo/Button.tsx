interface ButtonProps {
    readonly text: string;
    readonly onClick: () => void;
    readonly className?: string;  // optional
}

function Button({ text, onClick, className }: ButtonProps) {
    return (
        <button
            onClick={onClick}
            className={className}
        >
            {text}
        </button>
    );
}

export default Button;