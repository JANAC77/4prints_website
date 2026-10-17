import React, { useState, forwardRef } from 'react';
import { Icon } from '@iconify/react';

/**
 * Reusable TextInputField component
 * 
 * @param {Object} props
 * @param {string} [props.label] - Field label text
 * @param {React.ReactNode} [props.labelRight] - Component/link to render on top-right of label (e.g., "Forgot Password?")
 * @param {string} [props.id] - Input ID
 * @param {string} [props.name] - Input name
 * @param {string} [props.type='text'] - Input type (text, email, password, number, tel, etc.)
 * @param {string|number} [props.value] - Input value
 * @param {function} [props.onChange] - Change event handler
 * @param {string} [props.placeholder] - Placeholder text
 * @param {boolean} [props.required=false] - Whether field is required
 * @param {boolean} [props.disabled=false] - Whether field is disabled
 * @param {string|React.ReactNode} [props.leftIcon] - Icon name (Iconify string) or React element for left adornment
 * @param {string|React.ReactNode} [props.rightIcon] - Icon name (Iconify string) or React element for right adornment
 * @param {string} [props.error] - Error message string
 * @param {string} [props.helperText] - Helper description text below input
 * @param {string} [props.containerClassName] - Class name for the outermost wrapper container
 * @param {string} [props.inputClassName] - Class name override for input element
 * @param {boolean} [props.allowPasswordToggle=true] - Auto show/hide password toggle for type="password"
 */
const TextInputField = forwardRef(({
  label,
  labelRight,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  leftIcon,
  rightIcon,
  error,
  helperText,
  containerClassName = '',
  inputClassName = '',
  allowPasswordToggle = true,
  ...rest
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputId = id || name || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  // Render icon helper (either string for Iconify or custom React Node)
  const renderIcon = (icon) => {
    if (!icon) return null;
    if (typeof icon === 'string') {
      return <Icon icon={icon} className="text-xl" />;
    }
    return icon;
  };

  return (
    <div className={`w-full ${containerClassName}`}>
      {/* Label and optional Right element */}
      {(label || labelRight) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <label
              htmlFor={inputId}
              className="block text-xs font-semibold uppercase tracking-wider text-gray-700 cursor-pointer"
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          {labelRight && <div>{labelRight}</div>}
        </div>
      )}

      {/* Input container */}
      <div className="relative rounded-xl">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            {renderIcon(leftIcon)}
          </div>
        )}

        {/* Text Input */}
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={effectiveType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`
            w-full py-2.5 bg-white border rounded-xl text-gray-900 placeholder-gray-400 text-sm 
            focus:outline-none transition-all
            ${leftIcon ? 'pl-11' : 'pl-4'}
            ${rightIcon || (isPassword && allowPasswordToggle) ? 'pr-11' : 'pr-4'}
            ${error 
              ? 'border-red-400 focus:border-red-500' 
              : 'border-gray-200 hover:border-gray-400 focus:border-yellow-500 focus:border-1.5'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-75' : ''}
            ${inputClassName}
          `}
          {...rest}
        />

        {/* Password Toggle Button or Right Icon */}
        {isPassword && allowPasswordToggle ? (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
          >
            <Icon
              icon={showPassword ? 'iconamoon:eye-off' : 'iconamoon:eye'}
              className="text-xl"
            />
          </button>
        ) : (
          rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400">
              {renderIcon(rightIcon)}
            </div>
          )
        )}
      </div>

      {/* Error text or Helper text */}
      {error ? (
        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
          <Icon icon="solar:danger-circle-bold" className="text-sm shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      ) : null}
    </div>
  );
});

TextInputField.displayName = 'TextInputField';

export default TextInputField;
