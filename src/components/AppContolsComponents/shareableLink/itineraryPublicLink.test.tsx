// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import { ItineraryLink } from './itineraryPublicLink';

// describe('ItineraryLink', () => {
//   it('should render the copy icon', () => {
//     render(<ItineraryLink itineraryId="123" />);

//     const copyIcon = screen.getByTestId('copy-icon');
//     expect(copyIcon).toBeInTheDocument();
//   });

//   it('should call the copyToClipboard function when the button is clicked', () => {
//     const mockCopyToClipboard = jest.fn();

//     render(<ItineraryLink itineraryId="123" copyToClipboard={mockCopyToClipboard} />);

//     const button = screen.getByTestId('copy-button');
//     button.click();

//     expect(mockCopyToClipboard).toHaveBeenCalledWith('https://www.itinaru.com/viewItinerary/123');
//   });

//   it('should render a success message when the link is copied', () => {
//     render(<ItineraryLink itineraryId="123" />);

//     const button = screen.getByTestId('copy-button');
//     button.click();

//     const successMessage = screen.getByText('copied');
//     expect(successMessage).toBeInTheDocument();
//   });
// });
