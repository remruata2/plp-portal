/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server';
import { POST, GET } from '../route';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@/generated/prisma';
import { RemunerationCalculator } from '@/lib/calculations/remuneration-calculator';

// Mock dependencies
jest.mock('next-auth');
jest.mock('@/generated/prisma');
jest.mock('@/lib/calculations/remuneration-calculator');

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;
const mockPrisma = {
  facility: {
    findUnique: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
  fieldValue: {
    deleteMany: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
  },
  remunerationCalculation: {
    findUnique: jest.fn(),
  },
  $transaction: jest.fn(),
};

// Mock the PrismaClient constructor
(PrismaClient as jest.MockedClass<typeof PrismaClient>).mockImplementation(() => mockPrisma as any);

const mockRemunerationCalculator = {
  triggerRemunerationCalculation: jest.fn(),
  getStoredRemunerationCalculation: jest.fn(),
};

(RemunerationCalculator as any) = mockRemunerationCalculator;

describe('/api/health-data', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST - Submit health data', () => {
    const mockSession = {
      user: {
        id: 'user1',
        role: 'facility',
        facility_id: 'facility1',
      },
    };

    const mockFacility = {
      id: 'facility1',
      name: 'Test Facility',
      users: [{ id: 'user1' }],
    };

    it('should successfully submit health data with validation', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);
      mockPrisma.facility.findUnique.mockResolvedValue(mockFacility);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user1',
        facility: mockFacility,
      });

      const fieldValues = [
        {
          fieldId: 1,
          stringValue: null,
          numericValue: null,
          booleanValue: true,
          jsonValue: null,
          remarks: null,
        },
        {
          fieldId: 2,
          stringValue: null,
          numericValue: 5,
          booleanValue: null,
          jsonValue: null,
          remarks: 'Activity count',
        },
      ];

      const mockCreatedValues = fieldValues.map((fv, index) => ({
        id: `fv${index + 1}`,
        ...fv,
        facility_id: 'facility1',
        report_month: '2024-01',
      }));

      const mockRemunerationResult = {
        performancePercentage: 85,
        facilityRemuneration: 5000,
        totalWorkerRemuneration: 15000,
        totalRemuneration: 20000,
        healthWorkers: [{ id: 'hw1' }],
        ashaWorkers: [{ id: 'aw1' }],
      };

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        mockPrisma.fieldValue.deleteMany.mockResolvedValue({ count: 2 });
        
        fieldValues.forEach((fv, index) => {
          mockPrisma.fieldValue.create.mockResolvedValueOnce(mockCreatedValues[index]);
        });

        mockRemunerationCalculator.triggerRemunerationCalculation.mockResolvedValue(undefined);
        mockRemunerationCalculator.getStoredRemunerationCalculation.mockResolvedValue(mockRemunerationResult);

        return await callback(mockPrisma);
      });

      const request = new NextRequest('http://localhost:3000/api/health-data', {
        method: 'POST',
        body: JSON.stringify({
          facilityId: 'facility1',
          reportMonth: '2024-01',
          fieldValues,
        }),
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.message).toBe('Health data submitted successfully');
      expect(responseData.data.success).toBe(true);
      expect(responseData.data.fieldValues).toHaveLength(2);
      expect(responseData.data.remuneration).toMatchObject({
        performancePercentage: 85,
        facilityRemuneration: 5000,
        totalWorkerRemuneration: 15000,
        totalRemuneration: 20000,
        healthWorkersCount: 1,
        ashaWorkersCount: 1,
      });

      expect(mockPrisma.fieldValue.deleteMany).toHaveBeenCalledWith({
        where: {
          facility_id: 'facility1',
          report_month: '2024-01',
        },
      });

      expect(mockRemunerationCalculator.triggerRemunerationCalculation).toHaveBeenCalledWith(
        'facility1',
        '2024-01'
      );
    });

    it('should handle Field 20/21 conditional validation', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);
      mockPrisma.facility.findUnique.mockResolvedValue(mockFacility);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user1',
        facility: mockFacility,
      });

      // Test case: Field 20 = false, Field 21 should be forced to null
      const fieldValues = [
        {
          fieldId: 20, // elderly_support_group_formed
          stringValue: null,
          numericValue: null,
          booleanValue: false, // No group formed
          jsonValue: null,
          remarks: null,
        },
        {
          fieldId: 21, // elderly_support_group_activity  
          stringValue: null,
          numericValue: 5, // User tries to input activity count
          booleanValue: null,
          jsonValue: null,
          remarks: 'Should be ignored',
        },
      ];

      const mockCreatedValues = [
        {
          id: 'fv1',
          field_id: 20,
          facility_id: 'facility1',
          report_month: '2024-01',
          boolean_value: false,
          numeric_value: null,
          string_value: null,
          json_value: null,
        },
        {
          id: 'fv2',
          field_id: 21,
          facility_id: 'facility1',
          report_month: '2024-01',
          boolean_value: null,
          numeric_value: null, // Should be forced to null
          string_value: null,
          json_value: null,
        },
      ];

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        mockPrisma.fieldValue.deleteMany.mockResolvedValue({ count: 2 });
        
        mockPrisma.fieldValue.create
          .mockResolvedValueOnce(mockCreatedValues[0])
          .mockResolvedValueOnce(mockCreatedValues[1]);

        mockRemunerationCalculator.triggerRemunerationCalculation.mockResolvedValue(undefined);
        mockRemunerationCalculator.getStoredRemunerationCalculation.mockResolvedValue(null);

        return await callback(mockPrisma);
      });

      const request = new NextRequest('http://localhost:3000/api/health-data', {
        method: 'POST',
        body: JSON.stringify({
          facilityId: 'facility1',
          reportMonth: '2024-01',
          fieldValues,
        }),
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.data.success).toBe(true);
      
      // Verify that Field 21 value was properly handled despite user input
      const createdFieldValue21 = mockPrisma.fieldValue.create.mock.calls.find(
        call => call[0].data.field_id === 21
      );
      expect(createdFieldValue21[0].data.numeric_value).toBe(null);
    });

    it('should return 401 for unauthenticated requests', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/health-data', {
        method: 'POST',
        body: JSON.stringify({
          facilityId: 'facility1',
          reportMonth: '2024-01',
          fieldValues: [],
        }),
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.error).toBe('Unauthorized');
    });

    it('should return 400 for missing required fields', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);

      const request = new NextRequest('http://localhost:3000/api/health-data', {
        method: 'POST',
        body: JSON.stringify({
          facilityId: 'facility1',
          // Missing reportMonth and fieldValues
        }),
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toBe('Missing required fields');
    });

    it('should return 404 for non-existent facility', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);
      mockPrisma.facility.findUnique.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/health-data', {
        method: 'POST',
        body: JSON.stringify({
          facilityId: 'nonexistent',
          reportMonth: '2024-01',
          fieldValues: [],
        }),
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(404);
      expect(responseData.error).toBe('Facility not found');
    });

    it('should return 403 for facility user accessing wrong facility', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);
      mockPrisma.facility.findUnique.mockResolvedValue(mockFacility);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user1',
        facility: { id: 'different-facility' }, // Different facility
      });

      const request = new NextRequest('http://localhost:3000/api/health-data', {
        method: 'POST',
        body: JSON.stringify({
          facilityId: 'facility1',
          reportMonth: '2024-01',
          fieldValues: [],
        }),
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(403);
      expect(responseData.error).toBe('Access denied to this facility');
    });

    it('should continue on remuneration calculation failure', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);
      mockPrisma.facility.findUnique.mockResolvedValue(mockFacility);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user1',
        facility: mockFacility,
      });

      const fieldValues = [
        {
          fieldId: 1,
          numericValue: 100,
          booleanValue: null,
          stringValue: null,
          jsonValue: null,
        },
      ];

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        mockPrisma.fieldValue.deleteMany.mockResolvedValue({ count: 1 });
        mockPrisma.fieldValue.create.mockResolvedValue({
          id: 'fv1',
          field_id: 1,
          facility_id: 'facility1',
          report_month: '2024-01',
          numeric_value: 100,
        });

        // Simulate remuneration calculation failure
        mockRemunerationCalculator.triggerRemunerationCalculation.mockRejectedValue(
          new Error('Calculation failed')
        );

        return await callback(mockPrisma);
      });

      const request = new NextRequest('http://localhost:3000/api/health-data', {
        method: 'POST',
        body: JSON.stringify({
          facilityId: 'facility1',
          reportMonth: '2024-01',
          fieldValues,
        }),
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.data.success).toBe(true);
      expect(responseData.data.remuneration).toBe(null);
    });
  });

  describe('GET - Retrieve health data', () => {
    const mockSession = {
      user: {
        id: 'user1',
        role: 'facility',
        facility_id: 'facility1',
      },
    };

    const mockFacility = {
      id: 'facility1',
      name: 'Test Facility',
    };

    it('should successfully retrieve health data', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user1',
        facility: mockFacility,
      });

      const mockFieldValues = [
        {
          id: 'fv1',
          field_id: 1,
          facility_id: 'facility1',
          report_month: '2024-01',
          numeric_value: 100,
          field: { id: 1, code: 'total_footfall', name: 'Total Footfall' },
        },
        {
          id: 'fv2',
          field_id: 2,
          facility_id: 'facility1',
          report_month: '2024-01',
          boolean_value: true,
          field: { id: 2, code: 'elderly_support_group_formed', name: 'Elderly Support Group' },
        },
      ];

      const mockRemuneration = {
        id: 'rem1',
        facility_id: 'facility1',
        report_month: '2024-01',
        performance_percentage: 85,
        facility_remuneration: 5000,
        total_worker_remuneration: 15000,
        total_remuneration: 20000,
      };

      mockPrisma.fieldValue.findMany.mockResolvedValue(mockFieldValues);
      mockPrisma.remunerationCalculation.findUnique.mockResolvedValue(mockRemuneration);

      const url = new URL('http://localhost:3000/api/health-data');
      url.searchParams.set('facilityId', 'facility1');
      url.searchParams.set('reportMonth', '2024-01');

      const request = new NextRequest(url);
      const response = await GET(request);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.fieldValues).toHaveLength(2);
      expect(responseData.remuneration).toEqual(mockRemuneration);
    });

    it('should return 401 for unauthenticated requests', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const url = new URL('http://localhost:3000/api/health-data');
      url.searchParams.set('facilityId', 'facility1');
      url.searchParams.set('reportMonth', '2024-01');

      const request = new NextRequest(url);
      const response = await GET(request);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.error).toBe('Unauthorized');
    });

    it('should return 400 for missing query parameters', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);

      const url = new URL('http://localhost:3000/api/health-data');
      // Missing facilityId and reportMonth

      const request = new NextRequest(url);
      const response = await GET(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toBe('Missing facilityId or reportMonth');
    });

    it('should return 403 for facility user accessing wrong facility', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user1',
        facility: { id: 'different-facility' },
      });

      const url = new URL('http://localhost:3000/api/health-data');
      url.searchParams.set('facilityId', 'facility1');
      url.searchParams.set('reportMonth', '2024-01');

      const request = new NextRequest(url);
      const response = await GET(request);
      const responseData = await response.json();

      expect(response.status).toBe(403);
      expect(responseData.error).toBe('Access denied to this facility');
    });

    it('should handle admin role access to any facility', async () => {
      const adminSession = {
        user: {
          id: 'admin1',
          role: 'admin',
        },
      };

      mockGetServerSession.mockResolvedValue(adminSession);

      const mockFieldValues = [
        {
          id: 'fv1',
          field_id: 1,
          facility_id: 'facility1',
          report_month: '2024-01',
          numeric_value: 100,
          field: { id: 1, code: 'total_footfall', name: 'Total Footfall' },
        },
      ];

      mockPrisma.fieldValue.findMany.mockResolvedValue(mockFieldValues);
      mockPrisma.remunerationCalculation.findUnique.mockResolvedValue(null);

      const url = new URL('http://localhost:3000/api/health-data');
      url.searchParams.set('facilityId', 'facility1');
      url.searchParams.set('reportMonth', '2024-01');

      const request = new NextRequest(url);
      const response = await GET(request);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.fieldValues).toHaveLength(1);
      // Should not check facility access for admin
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
    });
  });
});
