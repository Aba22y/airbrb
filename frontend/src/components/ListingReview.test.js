import React from 'react';
import { render } from '@testing-library/react';
import { ListingReview } from './ListingReview';

test('renders Review component with given props', () => {
  const { getByText } = render(<ListingReview comment={'Great book!'} rating={4} />);

  expect(getByText('Great book!')).toBeInTheDocument();
})
