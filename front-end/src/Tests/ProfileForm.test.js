beforeAll(() => {
    window.matchMedia = window.matchMedia || function() {
      return {
        matches: false,
        addListener: function() {},
        removeListener: function() {}
      };
    };
  });


import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import SimpleForm from '../Components/UI/SimpleForm.js';

jest.mock('axios');

describe('SimpleForm Component', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: 'mock-slug' });
    axios.post.mockResolvedValue({ data: 'form-submitted' });
  });

  test('renders form elements correctly', () => {
    render(<SimpleForm />);
    
    expect(screen.getByLabelText(/First name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Level of experience/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Target role/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/LinkedIn URL/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/GitHub URL/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Slug/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Profile number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Score sheet URL/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload image/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload CV/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('validates form fields correctly', async () => {
    render(<SimpleForm />);

    fireEvent.change(screen.getByLabelText(/First name/i), { target: { value: 'john' } });
    fireEvent.change(screen.getByLabelText(/Last name/i), { target: { value: 'doe' } });
    fireEvent.blur(screen.getByLabelText(/First name/i));
    fireEvent.blur(screen.getByLabelText(/Last name/i));
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(2); // Ensure API call was made
    });
  });

  test('submits the form successfully', async () => {
    render(<SimpleForm />);

    fireEvent.change(screen.getByLabelText(/First name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Target role/i), { target: { value: 'Developer' } });
    fireEvent.change(screen.getByLabelText(/LinkedIn URL/i), { target: { value: 'https://linkedin.com/in/johndoe' } });
    fireEvent.change(screen.getByLabelText(/GitHub URL/i), { target: { value: 'https://github.com/johndoe' } });
    fireEvent.change(screen.getByLabelText(/Score sheet URL/i), { target: { value: 'https://docs.google.com/document/d/1' } });

    fireEvent.submit(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
      expect(axios.post).toHaveBeenCalled();
    });

    expect(screen.getByText('Form submitted successfully')).toBeInTheDocument();
  });
});
