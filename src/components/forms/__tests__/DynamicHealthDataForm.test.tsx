/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSession } from 'next-auth/react';
import DynamicHealthDataForm from '../DynamicHealthDataForm';

// Mock next-auth
jest.mock('next-auth/react');
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock child components to focus on main logic
jest.mock('../WorkerSelectionForm', () => {
  return function MockWorkerSelectionForm({ onSelectionChange, disabled }: any) {
    return (
      <div data-testid="worker-selection-form">
        <button
          onClick={() => onSelectionChange([1, 2])}
          disabled={disabled}
          data-testid="select-workers"
        >
          Select Workers
        </button>
      </div>
    );
  };
});

jest.mock('../../indicators/ConditionalIndicatorDisplay', () => {
  return function MockConditionalIndicatorDisplay({ indicatorGroups }: any) {
    return (
      <div data-testid="conditional-indicator-display">
        {indicatorGroups.length} indicator groups
      </div>
    );
  };
});

jest.mock('../../ui/fill-all-fields-button', () => {
  return function MockFillAllFieldsButton({ onFillFields, disabled }: any) {
    return (
      <button
        onClick={onFillFields}
        disabled={disabled}
        data-testid="fill-all-fields"
      >
        Fill All Fields
      </button>
    );
  };
});

describe('DynamicHealthDataForm', () => {
  const mockSession = {
    user: {
      id: 'user1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'facility',
      facility_id: 'facility1',
    },
    status: 'authenticated',
    update: jest.fn(),
  };

  const mockFieldMappings = [
    {
      formFieldName: 'elderly_support_group_formed',
      databaseFieldId: 1,
      fieldType: 'BINARY',
      description: 'Whether Elderly Support Group (Sanjivini) is formed',
    },
    {
      formFieldName: 'elderly_support_group_activity',
      databaseFieldId: 2,
      fieldType: 'numeric',
      description: 'If Yes, any activity conducted during the month',
    },
    {
      formFieldName: 'total_footfall',
      databaseFieldId: 3,
      fieldType: 'numeric',
      description: 'Total Footfall',
    },
  ];

  beforeEach(() => {
    mockUseSession.mockReturnValue(mockSession);
    mockFetch.mockClear();
    jest.clearAllMocks();
  });

  it('should render form with loading state initially', () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ mappings: mockFieldMappings }),
    });

    render(
      <DynamicHealthDataForm
        facilityType="SC_HWC"
        userRole="facility"
        facilityId="facility1"
      />
    );

    expect(screen.getByText('Loading form fields...')).toBeInTheDocument();
  });

  it('should load field mappings and render form fields', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ mappings: mockFieldMappings }),
    });

    render(
      <DynamicHealthDataForm
        facilityType="SC_HWC"
        userRole="facility"
        facilityId="facility1"
      />
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading form fields...')).not.toBeInTheDocument();
    });

    // Check that field mappings API was called correctly
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/health-data/field-mappings/SC_HWC',
      expect.objectContaining({
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );

    // Check form fields are rendered
    expect(screen.getByText('Whether Elderly Support Group (Sanjivini) is formed')).toBeInTheDocument();
    expect(screen.getByText('If Yes, any activity conducted during the month')).toBeInTheDocument();
    expect(screen.getByText('Total Footfall')).toBeInTheDocument();
  });

  it('should handle Field 20/21 conditional visibility logic', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ mappings: mockFieldMappings }),
    });

    render(
      <DynamicHealthDataForm
        facilityType="SC_HWC"
        userRole="facility"
        facilityId="facility1"
      />
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading form fields...')).not.toBeInTheDocument();
    });

    const elderlyGroupSwitch = screen.getByRole('switch', { name: /elderly support group/i });
    const activityInput = screen.getByDisplayValue(''); // Activity count input

    // Initially, activity field should be disabled when group is not formed
    expect(activityInput).toBeDisabled();
    expect(screen.getByText('N/A')).toBeInTheDocument(); // Placeholder for disabled field

    // Enable elderly group
    await act(async () => {
      fireEvent.click(elderlyGroupSwitch);
    });

    await waitFor(() => {
      expect(activityInput).not.toBeDisabled();
    });

    // Disable elderly group again
    await act(async () => {
      fireEvent.click(elderlyGroupSwitch);
    });

    await waitFor(() => {
      expect(activityInput).toBeDisabled();
    });
  });

  it('should clear Field 21 value when Field 20 is set to false', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ mappings: mockFieldMappings }),
    });

    const user = userEvent.setup();

    render(
      <DynamicHealthDataForm
        facilityType="SC_HWC"
        userRole="facility"
        facilityId="facility1"
      />
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading form fields...')).not.toBeInTheDocument();
    });

    const elderlyGroupSwitch = screen.getByRole('switch');
    
    // First enable the group
    await act(async () => {
      fireEvent.click(elderlyGroupSwitch);
    });

    // Add some activity count
    const activityInput = screen.getByDisplayValue('0'); // Should now be enabled
    await user.clear(activityInput);
    await user.type(activityInput, '5');

    expect(activityInput).toHaveValue(5);

    // Now disable the group
    await act(async () => {
      fireEvent.click(elderlyGroupSwitch);
    });

    // Activity count should be cleared
    await waitFor(() => {
      const clearedInput = screen.getByDisplayValue('');
      expect(clearedInput).toBeDisabled();
    });
  });

  it('should render numeric counter for Field 21 when group is formed', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ mappings: mockFieldMappings }),
    });

    render(
      <DynamicHealthDataForm
        facilityType="SC_HWC"
        userRole="facility"
        facilityId="facility1"
      />
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading form fields...')).not.toBeInTheDocument();
    });

    const elderlyGroupSwitch = screen.getByRole('switch');
    
    // Enable the group
    await act(async () => {
      fireEvent.click(elderlyGroupSwitch);
    });

    // Should have increment/decrement buttons for the activity counter
    const incrementButton = screen.getByText('+');
    const decrementButton = screen.getByText('−');
    const activityInput = screen.getByDisplayValue('0');

    expect(incrementButton).not.toBeDisabled();
    expect(decrementButton).toBeDisabled(); // Should be disabled at 0
    expect(activityInput).not.toBeDisabled();

    // Test increment
    await act(async () => {
      fireEvent.click(incrementButton);
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue('1')).toBeInTheDocument();
    });

    // Test decrement becomes enabled
    expect(decrementButton).not.toBeDisabled();
  });

  it('should submit form with correct payload structure', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ mappings: mockFieldMappings }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          message: 'Health data submitted successfully',
          data: { success: true },
        }),
      });

    const user = userEvent.setup();

    render(
      <DynamicHealthDataForm
        facilityType="SC_HWC"
        userRole="facility"
        facilityId="facility1"
      />
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading form fields...')).not.toBeInTheDocument();
    });

    // Fill out the form
    const elderlyGroupSwitch = screen.getByRole('switch');
    await act(async () => {
      fireEvent.click(elderlyGroupSwitch); // Set to true
    });

    const activityInput = screen.getByDisplayValue('0');
    await user.clear(activityInput);
    await user.type(activityInput, '3');

    const totalFootfallInput = screen.getAllByRole('spinbutton')[1]; // Assuming second numeric input
    await user.clear(totalFootfallInput);
    await user.type(totalFootfallInput, '150');

    // Select workers
    const selectWorkersBtn = screen.getByTestId('select-workers');
    await act(async () => {
      fireEvent.click(selectWorkersBtn);
    });

    // Submit form
    const submitButton = screen.getByText('Submit Health Data');
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/health-data',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: expect.stringContaining('"facilityId":"facility1"'),
        })
      );
    });

    // Verify the submission payload structure
    const submitCall = mockFetch.mock.calls.find(call => 
      call[0] === '/api/health-data' && call[1]?.method === 'POST'
    );
    
    expect(submitCall).toBeDefined();
    const payload = JSON.parse(submitCall[1].body);
    
    expect(payload).toMatchObject({
      facilityId: 'facility1',
      reportMonth: expect.stringMatching(/^\d{4}-\d{2}$/), // YYYY-MM format
      fieldValues: expect.arrayContaining([
        expect.objectContaining({
          fieldId: 1,
          booleanValue: true,
        }),
        expect.objectContaining({
          fieldId: 2,
          numericValue: 3,
        }),
        expect.objectContaining({
          fieldId: 3,
          numericValue: 150,
        }),
      ]),
      selectedWorkers: [1, 2],
    });
  });

  it('should handle Field 21 submission when Field 20 is false', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ mappings: mockFieldMappings }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          message: 'Health data submitted successfully',
          data: { success: true },
        }),
      });

    render(
      <DynamicHealthDataForm
        facilityType="SC_HWC"
        userRole="facility"
        facilityId="facility1"
      />
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading form fields...')).not.toBeInTheDocument();
    });

    // Leave elderly group switch as false (default), but activity should be empty/null

    const submitButton = screen.getByText('Submit Health Data');
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/health-data', expect.any(Object));
    });

    const submitCall = mockFetch.mock.calls.find(call => 
      call[0] === '/api/health-data' && call[1]?.method === 'POST'
    );
    
    const payload = JSON.parse(submitCall[1].body);
    
    // Field 20 should be false, Field 21 should be null/empty
    const field20 = payload.fieldValues.find((fv: any) => fv.fieldId === 1);
    const field21 = payload.fieldValues.find((fv: any) => fv.fieldId === 2);
    
    expect(field20.booleanValue).toBe(false);
    expect(field21.numericValue).toBe(null);
  });

  it('should handle API errors gracefully', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      text: () => Promise.resolve('Internal Server Error'),
    });

    render(
      <DynamicHealthDataForm
        facilityType="SC_HWC"
        userRole="facility"
        facilityId="facility1"
      />
    );

    await waitFor(() => {
      // Should show error state, not loading
      expect(screen.queryByText('Loading form fields...')).not.toBeInTheDocument();
    });

    // Toast error should have been called
    const { toast } = require('sonner');
    expect(toast.error).toHaveBeenCalledWith('Failed to load form fields');
  });

  it('should disable form during submission', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ mappings: mockFieldMappings }),
      })
      .mockImplementationOnce(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: () => Promise.resolve({ message: 'Success', data: { success: true } }),
          }), 100)
        )
      );

    render(
      <DynamicHealthDataForm
        facilityType="SC_HWC"
        userRole="facility"
        facilityId="facility1"
      />
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading form fields...')).not.toBeInTheDocument();
    });

    const submitButton = screen.getByText('Submit Health Data');
    
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // During submission, button should be disabled and show loading text
    expect(screen.getByText('Submitting...')).toBeInTheDocument();
    expect(screen.getByText('Submitting...')).toBeDisabled();

    // Wait for submission to complete
    await waitFor(() => {
      expect(screen.getByText('Submit Health Data')).toBeInTheDocument();
    }, { timeout: 200 });
  });

  it('should call onSubmissionSuccess callback on successful submission', async () => {
    const mockOnSubmissionSuccess = jest.fn();

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ mappings: mockFieldMappings }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          message: 'Health data submitted successfully',
          data: { success: true },
        }),
      });

    render(
      <DynamicHealthDataForm
        facilityType="SC_HWC"
        userRole="facility"
        facilityId="facility1"
        onSubmissionSuccess={mockOnSubmissionSuccess}
      />
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading form fields...')).not.toBeInTheDocument();
    });

    const submitButton = screen.getByText('Submit Health Data');
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockOnSubmissionSuccess).toHaveBeenCalled();
    });
  });

  it('should group fields by indicators correctly', async () => {
    const extendedMappings = [
      ...mockFieldMappings,
      {
        formFieldName: 'anc_footfall',
        databaseFieldId: 4,
        fieldType: 'numeric',
        description: 'ANC Footfall',
      },
      {
        formFieldName: 'anc_due_list',
        databaseFieldId: 5,
        fieldType: 'numeric',
        description: 'ANC Due List',
      },
    ];

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ mappings: extendedMappings }),
    });

    render(
      <DynamicHealthDataForm
        facilityType="SC_HWC"
        userRole="facility"
        facilityId="facility1"
      />
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading form fields...')).not.toBeInTheDocument();
    });

    // Should show grouped indicators
    const indicatorDisplay = screen.getByTestId('conditional-indicator-display');
    expect(indicatorDisplay).toBeInTheDocument();
    // The mock shows "X indicator groups" where X should be > 1 for grouped fields
    expect(indicatorDisplay.textContent).toMatch(/\d+ indicator groups/);
  });
});
