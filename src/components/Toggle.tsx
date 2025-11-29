import React, { useCallback, useEffect, useState } from "react";

interface ToggleProps {
  checked?: boolean;                    // modo controlled
  defaultChecked?: boolean;             // modo uncontrolled
  onChange?: (checked: boolean, e: React.MouseEvent | React.KeyboardEvent) => void;
  disabled?: boolean;
  className?: string;
  onColor?: string;                     // tailwind class
  offColor?: string;                    // tailwind class
}

export default function Toggle({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  className = "",
  onColor = "bg-blue-600",
  offColor = "bg-gray-400",
}: ToggleProps) {
  const isControlled = typeof checked === "boolean";

  const [internal, setInternal] = useState<boolean>(defaultChecked);

  const value = isControlled ? checked! : internal;

  const toggle = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      if (disabled) return;

      const next = !value;

      if (!isControlled) {
        setInternal(next);
      }

      if (onChange) {
        onChange(next, e);
      }
    },
    [disabled, value, isControlled, onChange]
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        toggle(e);
      }
    },
    [disabled, toggle]
  );

  useEffect(() => {
    if (!isControlled) {
      setInternal(defaultChecked);
    }
  }, [defaultChecked, isControlled]);

  const bgClass = value ? onColor : offColor;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-pressed={value}
      onClick={toggle}
      onKeyDown={onKeyDown}
      disabled={disabled}
      className={`
        relative inline-flex items-center rounded-full transition-colors duration-300
        ${bgClass}
        ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      style={{ width: 48, height: 32 }}
    >
      <span
        aria-hidden="true"
        className={`
          absolute h-6 w-6 bg-white rounded-full shadow transform transition-transform duration-300
          ${value ? "translate-x-5" : "translate-x-1"}
        `}
      />
    </button>
  );
}