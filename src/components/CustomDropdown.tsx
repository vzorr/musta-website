'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/CustomDropdown.module.css';

interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  name: string;
  required?: boolean;
  className?: string;
}

export default function CustomDropdown({
  options,
  value,
  onChange,
  placeholder,
  name,
  required = false,
  className = ''
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update selected label when value changes
  useEffect(() => {
    const selectedOption = options.find(option => option.value === value);
    const newLabel = selectedOption ? selectedOption.label : '';
    setSelectedLabel(newLabel);
  }, [value, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: DropdownOption) => {
    onChange(option.value);
    setSelectedLabel(option.label);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={className}>
      <div className={styles.customDropdown}>
        {/* Input Field */}
        <div 
          className={`${styles.dropdownField} ${isOpen ? styles.open : ''}`}
          onClick={handleToggle}
        >
          <span className={styles.fieldText}>
            {selectedLabel || placeholder}
          </span>
          <div className={`${styles.chevron} ${isOpen ? styles.chevronUp : styles.chevronDown}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6,9 12,15 18,9"></polyline>
            </svg>
          </div>
        </div>

        {/* Hidden input for form submission */}
        <input
          type="hidden"
          name={name}
          value={value}
          required={required}
        />
      </div>

      {/* Dropdown Options - Rendered as separate field */}
      {isOpen && (
        <div className={styles.dropdownOptions}>
          {options.map((option) => (
            <div
              key={option.value}
              className={`${styles.option} ${value === option.value ? styles.selected : ''}`}
              onClick={() => handleOptionClick(option)}
            >
              <div className={styles.checkbox}>
                {value === option.value && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20,6 9,17 4,12"></polyline>
                  </svg>
                )}
              </div>
              <span className={styles.optionLabel}>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
