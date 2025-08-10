/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { useSession } from 'next-auth/react';
import DynamicHealthDataForm from '@/components/forms/DynamicHealthDataForm';

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

// Mock child components
jest.mock('@/components/forms/WorkerSelectionForm', () => {
  return function MockWorkerSelectionForm({ onSelectionChange, disabled }: any) {
    return React.createElement('div', { 'data-testid': 'worker-selection-form' },
      React.createElement('button', {
        onClick: () => onSelectionChange([1, 2, 3]),
        disabled,
        'data-testid': 'select-workers'
      }, 'Select Workers (3)'),
      React.createElement('div', null, `Selected: ${disabled ? 'Disabled' : 'Enabled'}`)
    );
  };
});

jest.mock('@/components/indicators/ConditionalIndicatorDisplay', () => {
  return function MockConditionalIndicatorDisplay({ indicatorGroups, formData }: any) {
    const elderlyGroupFormed = formData?.elderly_support_group_formed === '1' || formData?.elderly_support_group_formed === true;
    return React.createElement('div', { 'data-testid': 'conditional-indicator-display' },
      React.createElement('div', null, `Elderly Group Formed: ${elderlyGroupFormed ? 'Yes' : 'No'}`),
      React.createElement('div', null, `Activity Field Visible: ${elderlyGroupFormed ? 'Yes' : 'No'}`),
      React.createElement('div', null, `Indicator Groups: ${indicatorGroups.length}`)
    );
  };
});

jest.mock('@/components/ui/fill-all-fields-button', () => {
  return function MockFillAllFieldsButton({ onFillFields, disabled }: any) {
    return React.createElement('button', {
      onClick: onFillFields,
      disabled,
      'data-testid': 'fill-all-fields'
    }, 'Fill All Fields');
  };
});

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('End-to-End Form Flow Tests', () => {
  const mockSession = {
    user: {
      id: 'user1',
      name: 'Test Facility User',
      email: 'facility@example.com',
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
      description: 'Total Footfall (M&F)',
    },
    {
      formFieldName: 'anc_footfall',
      databaseFieldId: 4,
      fieldType: 'numeric',
      description: 'Total ANC footfall',
    },
    {
      formFieldName: 'wellness_sessions_conducted',
      databaseFieldId: 5,
      fieldType: 'numeric',
      description: 'Total Wellness sessions',
    },
  ];

  beforeEach(() => {
    mockUseSession.mockReturnValue(mockSession);
    mockFetch.mockClear();
    jest.clearAllMocks();
  });

  describe('Complete Form Flow - YES Branch (Elderly Group Formed)', () => {
    it('should complete full form submission when elderly group is formed', async () => {
      // Setup fetch mocks
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ 
            facilityType: 'SC_HWC',
            mappings: mockFieldMappings 
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            message: 'Health data submitted successfully',
            data: { 
              success: true,
              fieldValues: mockFieldMappings.map((m, i) => ({ id: `fv${i + 1}`, field_id: m.databaseFieldId })),
              remuneration: {
                performancePercentage: 92,
                facilityRemuneration: 6000,
                totalWorkerRemuneration: 18000,
                totalRemuneration: 24000,
                healthWorkersCount: 2,
                ashaWorkersCount: 1,
              }
            },
          }),
        });

      const user = userEvent.setup();

      render(
        <DynamicHealthDataForm
          facilityType="SC_HWC"
          userRole="facility"
          facilityId="facility1"
          onSubmissionSuccess={() => console.log('Form submitted successfully!')}
        />
      );

      // Wait for form to load
      await waitFor(() => {
        expect(screen.queryByText('Loading form fields...')).not.toBeInTheDocument();
      });

      // Verify initial state - elderly activity field should be disabled
      const elderlyGroupSwitch = screen.getByRole('switch');
      const activityInput = screen.getByDisplayValue(''); // Empty and disabled initially
      
      expect(elderlyGroupSwitch).not.toBeChecked();
      expect(activityInput).toBeDisabled();

      // Step 1: Enable elderly support group (YES branch)
      await act(async () => {
        fireEvent.click(elderlyGroupSwitch);
      });

      // Verify elderly group is now formed and activity field is enabled
      await waitFor(() => {
        expect(elderlyGroupSwitch).toBeChecked();
        expect(screen.getByDisplayValue('0')).not.toBeDisabled(); // Activity input now enabled
      });

      // Verify conditional display updates
      expect(screen.getByText('Elderly Group Formed: Yes')).toBeInTheDocument();
      expect(screen.getByText('Activity Field Visible: Yes')).toBeInTheDocument();

      // Step 2: Fill in elderly activity count using counter
      const incrementButton = screen.getByText('+');
      
      // Click increment 7 times to set activity count to 7
      for (let i = 0; i < 7; i++) {
        await act(async () => {
          fireEvent.click(incrementButton);
        });
      }

      await waitFor(() => {
        expect(screen.getByDisplayValue('7')).toBeInTheDocument();
      });

      // Step 3: Fill in other numeric fields
      const footfallInputs = screen.getAllByRole('spinbutton').filter(input => 
        !input.closest('[data-testid*="elderly"]')
      );

      // Total footfall
      await user.clear(footfallInputs[0]);
      await user.type(footfallInputs[0], '250');

      // ANC footfall
      await user.clear(footfallInputs[1]);
      await user.type(footfallInputs[1], '45');

      // Wellness sessions
      await user.clear(footfallInputs[2]);
      await user.type(footfallInputs[2], '12');

      // Step 4: Select workers
      const selectWorkersBtn = screen.getByTestId('select-workers');
      await act(async () => {
        fireEvent.click(selectWorkersBtn);
      });

      // Verify workers are selected
      expect(screen.getByText('Select Workers (3)')).toBeInTheDocument();

      // Step 5: Submit form
      const submitButton = screen.getByText('Submit Health Data');
      await act(async () => {
        fireEvent.click(submitButton);
      });

      // Verify submission started
      expect(screen.getByText('Submitting...')).toBeInTheDocument();

      // Wait for submission to complete
      await waitFor(() => {
        expect(screen.getByText('Submit Health Data')).toBeInTheDocument();
      });

      // Verify API calls
      expect(mockFetch).toHaveBeenCalledTimes(2);
      
      // Check field mappings call
      expect(mockFetch).toHaveBeenNthCalledWith(1,
        '/api/health-data/field-mappings/SC_HWC',
        expect.objectContaining({
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
      );

      // Check submission call
      expect(mockFetch).toHaveBeenNthCalledWith(2,
        '/api/health-data',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );

      // Verify submission payload
      const submitCall = mockFetch.mock.calls[1];
      const payload = JSON.parse(submitCall[1].body);

      expect(payload).toMatchObject({
        facilityId: 'facility1',
        reportMonth: expect.stringMatching(/^\d{4}-\d{2}$/),
        fieldValues: expect.arrayContaining([
          expect.objectContaining({
            fieldId: 1,
            booleanValue: true, // Elderly group formed = YES
          }),
          expect.objectContaining({
            fieldId: 2,
            numericValue: 7, // Activity count = 7
          }),
          expect.objectContaining({
            fieldId: 3,
            numericValue: 250, // Total footfall
          }),
          expect.objectContaining({
            fieldId: 4,
            numericValue: 45, // ANC footfall
          }),
          expect.objectContaining({
            fieldId: 5,
            numericValue: 12, // Wellness sessions
          }),
        ]),
        selectedWorkers: [1, 2, 3],
      });

      // Verify success toast
      const { toast } = require('sonner');
      expect(toast.success).toHaveBeenCalled();
    });
  });

  describe('Complete Form Flow - NO Branch (Elderly Group Not Formed)', () => {
    it('should complete full form submission when elderly group is not formed', async () => {
      // Setup fetch mocks
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ 
            facilityType: 'SC_HWC',
            mappings: mockFieldMappings 
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            message: 'Health data submitted successfully',
            data: { 
              success: true,
              fieldValues: mockFieldMappings.map((m, i) => ({ id: `fv${i + 1}`, field_id: m.databaseFieldId })),
              remuneration: {
                performancePercentage: 78,
                facilityRemuneration: 4500,
                totalWorkerRemuneration: 13500,
                totalRemuneration: 18000,
                healthWorkersCount: 2,
                ashaWorkersCount: 1,
              }
            },
          }),
        });

      const user = userEvent.setup();

      render(
        <DynamicHealthDataForm
          facilityType="SC_HWC"
          userRole="facility"
          facilityId="facility1"
          onSubmissionSuccess={() => console.log('Form submitted successfully!')}
        />
      );

      // Wait for form to load
      await waitFor(() => {
        expect(screen.queryByText('Loading form fields...')).not.toBeInTheDocument();
      });

      // Verify initial state - elderly group not formed (NO branch)
      const elderlyGroupSwitch = screen.getByRole('switch');
      const activityInput = screen.getByDisplayValue(''); // Empty and disabled
      
      expect(elderlyGroupSwitch).not.toBeChecked();
      expect(activityInput).toBeDisabled();
      expect(screen.getByText('N/A')).toBeInTheDocument(); // Disabled placeholder

      // Verify conditional display shows NO branch
      expect(screen.getByText('Elderly Group Formed: No')).toBeInTheDocument();
      expect(screen.getByText('Activity Field Visible: No')).toBeInTheDocument();

      // Step 1: Keep elderly support group as NO (default state)
      // No action needed - switch remains unchecked

      // Step 2: Verify activity field remains disabled and empty
      expect(activityInput).toBeDisabled();
      expect(activityInput).toHaveDisplayValue('');

      // Step 3: Fill in other numeric fields (non-conditional)
      const footfallInputs = screen.getAllByRole('spinbutton').filter(input => 
        !input.closest('[data-testid*="elderly"]') && !input.disabled
      );

      // Total footfall
      await user.clear(footfallInputs[0]);
      await user.type(footfallInputs[0], '180');

      // ANC footfall
      await user.clear(footfallInputs[1]);
      await user.type(footfallInputs[1], '25');

      // Wellness sessions
      await user.clear(footfallInputs[2]);
      await user.type(footfallInputs[2], '8');

      // Step 4: Select workers
      const selectWorkersBtn = screen.getByTestId('select-workers');
      await act(async () => {
        fireEvent.click(selectWorkersBtn);
      });

      // Step 5: Submit form
      const submitButton = screen.getByText('Submit Health Data');
      await act(async () => {
        fireEvent.click(submitButton);
      });

      // Verify submission started
      expect(screen.getByText('Submitting...')).toBeInTheDocument();

      // Wait for submission to complete
      await waitFor(() => {
        expect(screen.getByText('Submit Health Data')).toBeInTheDocument();
      });

      // Verify submission payload for NO branch
      const submitCall = mockFetch.mock.calls[1];
      const payload = JSON.parse(submitCall[1].body);

      expect(payload).toMatchObject({
        facilityId: 'facility1',
        reportMonth: expect.stringMatching(/^\d{4}-\d{2}$/),
        fieldValues: expect.arrayContaining([
          expect.objectContaining({
            fieldId: 1,
            booleanValue: false, // Elderly group formed = NO
          }),
          expect.objectContaining({
            fieldId: 2,
            numericValue: null, // Activity count forced to null
          }),
          expect.objectContaining({
            fieldId: 3,
            numericValue: 180, // Total footfall
          }),
          expect.objectContaining({
            fieldId: 4,
            numericValue: 25, // ANC footfall
          }),
          expect.objectContaining({
            fieldId: 5,
            numericValue: 8, // Wellness sessions
          }),
        ]),
        selectedWorkers: [1, 2, 3],
      });

      // Verify success
      const { toast } = require('sonner');
      expect(toast.success).toHaveBeenCalled();
    });
  });

  describe('Form Flow State Transitions', () => {
    it('should handle YES -> NO -> YES transitions correctly', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ 
          facilityType: 'SC_HWC',
          mappings: mockFieldMappings 
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

      const elderlyGroupSwitch = screen.getByRole('switch');

      // Initial state: NO
      expect(elderlyGroupSwitch).not.toBeChecked();
      expect(screen.getByText('Elderly Group Formed: No')).toBeInTheDocument();

      // Transition: NO -> YES
      await act(async () => {
        fireEvent.click(elderlyGroupSwitch);
      });

      await waitFor(() => {
        expect(elderlyGroupSwitch).toBeChecked();
        expect(screen.getByText('Elderly Group Formed: Yes')).toBeInTheDocument();
        expect(screen.getByDisplayValue('0')).not.toBeDisabled(); // Activity field enabled
      });

      // Add activity count
      const incrementButton = screen.getByText('+');
      await act(async () => {
        fireEvent.click(incrementButton);
      });

      expect(screen.getByDisplayValue('1')).toBeInTheDocument();

      // Transition: YES -> NO
      await act(async () => {
        fireEvent.click(elderlyGroupSwitch);
      });

      await waitFor(() => {
        expect(elderlyGroupSwitch).not.toBeChecked();
        expect(screen.getByText('Elderly Group Formed: No')).toBeInTheDocument();
        expect(screen.getByDisplayValue('')).toBeDisabled(); // Activity field disabled and cleared
      });

      // Transition: NO -> YES again
      await act(async () => {
        fireEvent.click(elderlyGroupSwitch);
      });

      await waitFor(() => {
        expect(elderlyGroupSwitch).toBeChecked();
        expect(screen.getByText('Elderly Group Formed: Yes')).toBeInTheDocument();
        expect(screen.getByDisplayValue('0')).not.toBeDisabled(); // Activity field enabled, reset to 0
      });
    });

    it('should preserve other field values during YES/NO transitions', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ 
          facilityType: 'SC_HWC',
          mappings: mockFieldMappings 
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

      // Fill non-conditional fields first
      const footfallInputs = screen.getAllByRole('spinbutton').filter(input => 
        !input.closest('[data-testid*="elderly"]') && !input.disabled
      );

      await user.clear(footfallInputs[0]);
      await user.type(footfallInputs[0], '300');

      // Toggle elderly group
      const elderlyGroupSwitch = screen.getByRole('switch');
      await act(async () => {
        fireEvent.click(elderlyGroupSwitch); // YES
      });

      await act(async () => {
        fireEvent.click(elderlyGroupSwitch); // NO
      });

      // Verify other field values are preserved
      expect(screen.getByDisplayValue('300')).toBeInTheDocument();
    });
  });

  describe('Error Handling in Form Flow', () => {
    it('should handle network errors during form submission gracefully', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ 
            facilityType: 'SC_HWC',
            mappings: mockFieldMappings 
          }),
        })
        .mockRejectedValueOnce(new Error('Network Error'));

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

      // Try to submit
      const submitButton = screen.getByText('Submit Health Data');
      await act(async () => {
        fireEvent.click(submitButton);
      });

      // Should return to normal state after error
      await waitFor(() => {
        expect(screen.getByText('Submit Health Data')).toBeInTheDocument();
      });

      // Error toast should be shown
      const { toast } = require('sonner');
      expect(toast.error).toHaveBeenCalled();
    });

    it('should handle server validation errors', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ 
            facilityType: 'SC_HWC',
            mappings: mockFieldMappings 
          }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 400,
          json: () => Promise.resolve({
            error: 'Validation failed',
            details: 'Invalid field values provided'
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

      const submitButton = screen.getByText('Submit Health Data');
      await act(async () => {
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Submit Health Data')).toBeInTheDocument();
      });

      const { toast } = require('sonner');
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('submit'));
    });
  });

  describe('Performance and Loading States', () => {
    it('should show proper loading states throughout the flow', async () => {
      // Simulate slow field mapping fetch
      mockFetch.mockImplementationOnce(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: () => Promise.resolve({ mappings: mockFieldMappings }),
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

      // Should show loading initially
      expect(screen.getByText('Loading form fields...')).toBeInTheDocument();

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText('Loading form fields...')).not.toBeInTheDocument();
      }, { timeout: 200 });

      // Form should be fully loaded
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });
  });
});
