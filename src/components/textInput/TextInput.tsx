import React from 'react';
import styles from './textInput.module.css';

interface TextInputProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  width?: string; 
  height?: string; 
}

const TextInput: React.FC<TextInputProps> = ({
  placeholder,
  value,
  onChange,
  width = '590px',
  height = '100px', 
}) => {
  return (
    <input
      checked
      className={styles.textInput}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{ width, height }}
    />
  );
};

export default TextInput;
