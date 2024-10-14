import React from 'react';

interface OptionProps {
  option: {
    id: number;
    text: string;
  };
  onSelect: (id: number) => void;
}

const Option: React.FC<OptionProps> = ({ option, onSelect }) => {
  return (
    <div>
      <input
        type="radio"
        id={option.id.toString()}
        name="poll-option"
        value={option.id}
        onChange={() => onSelect(option.id)}
      />
      <label htmlFor={option.id.toString()}>{option.text}</label>
    </div>
  );
};

export default Option;
