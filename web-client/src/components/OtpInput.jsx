import { useRef } from "react";

export function OtpInput({
  value,
  onChange,
  length = 6,
  disabled = false,
  autoFocus = false,
  ariaLabel = "Verification code",
}) {
  const inputsRef = useRef([]);
  const digits = Array.from({ length }, (_, index) => value[index] || "");

  const focusInput = (index) => {
    inputsRef.current[index]?.focus();
    inputsRef.current[index]?.select();
  };

  const updateDigits = (nextDigits) => {
    onChange(nextDigits.join("").slice(0, length));
  };

  const fillFromIndex = (startIndex, inputValue) => {
    const incomingDigits = inputValue.replace(/\D/g, "").slice(0, length);

    if (!incomingDigits) {
      return;
    }

    const nextDigits = [...digits];

    incomingDigits.split("").forEach((digit, offset) => {
      const nextIndex = startIndex + offset;

      if (nextIndex < length) {
        nextDigits[nextIndex] = digit;
      }
    });

    updateDigits(nextDigits);
    focusInput(Math.min(startIndex + incomingDigits.length, length - 1));
  };

  const handleChange = (index, inputValue) => {
    if (!/^\d*$/.test(inputValue)) {
      return;
    }

    if (inputValue.length > 1) {
      fillFromIndex(index, inputValue);
      return;
    }

    const nextDigits = [...digits];
    nextDigits[index] = inputValue;
    updateDigits(nextDigits);

    if (inputValue && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace") {
      if (digits[index]) {
        const nextDigits = [...digits];
        nextDigits[index] = "";
        updateDigits(nextDigits);
        return;
      }

      if (index > 0) {
        focusInput(index - 1);
      }
    }

    if (event.key === "ArrowLeft" && index > 0) {
      focusInput(index - 1);
    }

    if (event.key === "ArrowRight" && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handlePaste = (index, event) => {
    event.preventDefault();
    fillFromIndex(index, event.clipboardData.getData("text"));
  };

  return (
    <div className="flex justify-between gap-2">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            inputsRef.current[index] = element;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digit}
          autoFocus={autoFocus && index === 0}
          disabled={disabled}
          aria-label={`${ariaLabel} digit ${index + 1}`}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={(event) => handlePaste(index, event)}
          className="h-12 w-10 rounded-xl border text-center text-lg font-bold outline-none app-input-shell app-text sm:h-14 sm:w-12 sm:text-xl"
        />
      ))}
    </div>
  );
}
