'use client';
import { useEffect, useId, useState } from 'react';
import { parseNumberInput } from '../lib/input';
export default function NumberField({
  value,
  onValue,
  onValidity,
  min,
  max,
  integer = false,
  en = false,
  id,
  step = 1,
}: {
  value: number;
  onValue: (n: number) => void;
  onValidity?: (valid: boolean) => void;
  min: number;
  max: number;
  integer?: boolean;
  en?: boolean;
  id?: string;
  step?: number;
}) {
  const [raw, setRaw] = useState(String(value));
  const errorId = useId();
  useEffect(() => {
    setRaw(String(value));
    onValidity?.(true);
  }, [value]);
  const invalid = parseNumberInput(raw, min, max, integer) === null;
  return (
    <span className="number-field">
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        step={step}
        value={raw}
        aria-invalid={invalid}
        aria-describedby={invalid ? errorId : undefined}
        onChange={(e) => {
          const text = e.target.value;
          setRaw(text);
          const next = parseNumberInput(text, min, max, integer);
          onValidity?.(next !== null);
          if (next !== null) onValue(next);
        }}
      />
      {invalid && (
        <span id={errorId} className="field-error">
          {en
            ? `Enter ${integer ? 'a whole number' : 'a number'} from ${min} to ${max}.`
            : `请输入 ${min}–${max} 之间的${integer ? '整数' : '数字'}。`}
        </span>
      )}
    </span>
  );
}
