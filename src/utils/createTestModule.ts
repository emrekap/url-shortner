import { ModuleMetadata } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Config, configMock } from '../modules/config/config-factory';
import { PrismaService } from '../modules/data-access/prisma.service';
import { mockDeep } from 'jest-mock-extended';

export const mockPrismaClient = mockDeep<PrismaService>({
  $transaction: jest.fn().mockResolvedValue(({ data }) => data),
  url: {
    create: jest.fn().mockImplementation(({ data }) => data),
    findUnique: jest.fn().mockImplementation(({ data }) => data),
  },
  urlStats: {
    findUnique: jest.fn().mockImplementation(({ data }) => data),
    findMany: jest.fn().mockImplementation(({ data }) => data),
    create: jest.fn().mockImplementation(({ data }) => data),
    update: jest.fn().mockImplementation(({ data }) => data),
  },
});

export const createTestingModule = (metadata: ModuleMetadata) => {
  return Test.createTestingModule(metadata)
    .overrideProvider(PrismaService)
    .useValue(mockPrismaClient)
    .overrideProvider(Config)
    .useValue(configMock);
};
