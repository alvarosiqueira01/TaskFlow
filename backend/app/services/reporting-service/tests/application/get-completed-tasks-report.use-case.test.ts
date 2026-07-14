import { GetCompletedTasksReportUseCase } from '../../src/application/use-cases/get-completed-tasks-report.use-case.js';
import { InvalidDateRangeError } from '../../src/domain/exceptions/reporting.exceptions.js';

function buildRepository() {
  return {
    upsert: jest.fn(),
    findById: jest.fn(),
    incrementCommentsCount: jest.fn(),
    incrementMediaCount: jest.fn(),
    decrementMediaCount: jest.fn(),
    findCompleted: jest.fn().mockResolvedValue([]),
    findPending: jest.fn(),
    getDashboardStats: jest.fn(),
  };
}

describe('GetCompletedTasksReportUseCase', () => {
  it('passes the parsed date range and ownerId scope to the repository', async () => {
    const repository = buildRepository();
    const useCase = new GetCompletedTasksReportUseCase(repository as any);

    await useCase.execute({
      requesterId: 'user-1',
      requesterRoles: [],
      startDate: '2026-01-01',
      endDate: '2026-01-31',
    });

    expect(repository.findCompleted).toHaveBeenCalledWith({
      ownerId: 'user-1',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-01-31'),
    });
  });

  it('throws InvalidDateRangeError when startDate is after endDate', async () => {
    const repository = buildRepository();
    const useCase = new GetCompletedTasksReportUseCase(repository as any);

    await expect(
      useCase.execute({
        requesterId: 'user-1',
        requesterRoles: [],
        startDate: '2026-02-01',
        endDate: '2026-01-01',
      }),
    ).rejects.toThrow(InvalidDateRangeError);
  });

  it('does not scope to ownerId for privileged roles', async () => {
    const repository = buildRepository();
    const useCase = new GetCompletedTasksReportUseCase(repository as any);

    await useCase.execute({ requesterId: 'admin-1', requesterRoles: ['ADMINISTRATOR'] });

    expect(repository.findCompleted).toHaveBeenCalledWith({
      ownerId: undefined,
      startDate: undefined,
      endDate: undefined,
    });
  });
});
