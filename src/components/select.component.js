import React from 'react';
import { Layout, Select } from '@ui-kitten/components';

export const PaperSelect = ({ label, placeholder, data, multiSelect, selectedOption, onSelect, disabled }) => {

  return (
    <Layout>
      <Select
        label={label}
        placeholder={placeholder}
        multiSelect={multiSelect}
        data={data}
        selectedOption={selectedOption}
        onSelect={onSelect}
        style={{marginBottom: 10}}
        disabled={disabled}
      />
    </Layout>
  );
};