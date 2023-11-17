import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { FuncButton } from './FuncButton'

describe('<FuncButton>', () => {
  it('renders the button as disabled', () => {
    const fn = jest.fn();
    const { getByText } = render(
      <FuncButton
        enabled={false}
        function={fn}
        text="Button"
        color="primary"
      />
    );

    const button = getByText('Button');
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled()
  })

  it('renders the button as enabled', async () => {
    const fn = jest.fn();
    const { getByText } = render(
      <FuncButton
        enabled={true}
        function={fn}
        text="Button"
        color="primary"
      />
    );

    const button = getByText('Button');
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled()
  })

  it('the button calls the function upon click', async () => {
    const fn = jest.fn();
    const { getByText } = render(
      <FuncButton
        enabled={true}
        function={fn}
        text="Button"
        color="primary"
      />
    );

    const button = getByText('Button');
    await userEvent.click(button);
    expect(fn).toHaveBeenCalled();
  })
})
