'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/CustomDropdown.module.css';

interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder: string;
  name: string;
  required?: boolean;
  className?: string;
  multiple?: boolean;
}

export default function CustomDropdown({
  options,
  value,
  onChange,
  placeholder,
  name,
  required = false,
  className = '',
  multiple = false
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update selected label when value changes
  useEffect(() => {
    if (multiple) {
      const selectedValues = Array.isArray(value) ? value : [];
      const selectedOptions = options.filter(option => selectedValues.includes(option.value));
      const fieldName = name.charAt(0).toUpperCase() + name.slice(1);
      const newLabel = selectedOptions.length > 0 
        ? `${fieldName}: ${selectedOptions.map(option => option.label).join(', ')}`
        : '';
      setSelectedLabel(newLabel);
    } else {
      const selectedOption = options.find(option => option.value === value);
      const newLabel = selectedOption ? selectedOption.label : '';
      setSelectedLabel(newLabel);
    }
  }, [value, options, multiple, name]);

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
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const isSelected = currentValues.includes(option.value);
      
      if (isSelected) {
        // Remove from selection
        const newValues = currentValues.filter(v => v !== option.value);
        onChange(newValues);
      } else {
        // Add to selection
        const newValues = [...currentValues, option.value];
        onChange(newValues);
      }
      // Don't close dropdown in multiple mode
    } else {
      // Single selection mode
      if (value === option.value) {
        onChange('');
        setSelectedLabel('');
      } else {
        onChange(option.value);
        setSelectedLabel(option.label);
      }
      setIsOpen(false);
    }
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
        {multiple ? (
          Array.isArray(value) && value.map((val, index) => (
            <input
              key={index}
              type="hidden"
              name={`${name}[]`}
              value={val}
              required={required && index === 0}
            />
          ))
        ) : (
          <input
            type="hidden"
            name={name}
            value={value}
            required={required}
          />
        )}
      </div>

      {/* Dropdown Options - Rendered as separate field */}
      {isOpen && (
        <div className={styles.dropdownOptions}>
          {options.map((option) => {
            const isSelected = multiple 
              ? Array.isArray(value) && value.includes(option.value)
              : value === option.value;
            
            return (
              <div
                key={option.value}
                className={`${styles.option} ${isSelected ? styles.selected : ''}`}
                onClick={() => handleOptionClick(option)}
              >
                <div className={styles.checkbox}>
                  {isSelected ? (
                    <img 
                      src="/assets/completed.svg" 
                      alt="Selected" 
                      width="18" 
                      height="18"
                    />
                  ) : (
                    <img 
                      src="/assets/unselected.svg" 
                      alt="Unselected" 
                      width="18" 
                      height="18"
                    />
                  )}
                </div>
                <span className={styles.optionLabel}>{option.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
