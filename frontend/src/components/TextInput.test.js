import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { TextInput } from './TextInput';

describe('TextInput', () => {
  test('renders with label', () => {
    const { getByLabelText } = render(<TextInput label="Username" />);
    const input = getByLabelText('Username');
    expect(input).toBeInTheDocument();
  });

  test('calls onChange function when input changes', () => {
    const mockChange = jest.fn();
    const { getByLabelText } = render(<TextInput label="Username" function={mockChange} />);
    const input = getByLabelText('Username');

    userEvent.type(input, 'test');
    expect(mockChange).toHaveBeenCalledTimes(4);
  });
})
