import { GetDashboardReportUseCase } from '../../src/application/use-cases/get-dashboard-report.use-case.js';

function buildRepository(stats = { totalTasks: 10, completedTasks: 4, pendingTasks: 6, overdueTasks: 2 }) {
  return {
    upsert: jest.fn(),
    findById: jest.fn(),
    incrementCommentsCount: jest.fn(),
    incrementMediaCount: jest.fn(),
    decrementMediaCount: jest.fn(),
    findCompleted: jest.fn(),
    findPending: jest.fn(),
    getDashboardStats: jest.fn().mockResolvedValue(stats),
  };
}

describe('GetDashboardReportUseCase', () => {
  it('scopes to the requester ownerId for non-privileged roles', async () => {
    const repository = buildRepository();
    const useCase = new GetDashboardReportUseCase(repository as any);

    await useCase.execute({ requesterId: 'user-1', requesterRoles: ['TEAM_MEMBER'] });

    expect(repository.getDashboardStats).toHaveBeenCalledWith({ ownerId: 'user-1' });
  });

  it('does not scope to ownerId for ADMINISTRATOR', async () => {
    const repository = buildRepository();
    const useCase = new GetDashboardReportUseCase(repository as any);

    await useCase.execute({ requesterId: 'admin-1', requesterRoles: ['ADMINISTRATOR'] });

    expect(repository.getDashboardStats).toHaveBeenCalledWith({ ownerId: undefined });
  });

  it('does not scope to ownerId for PROJECT_MANAGER', async () => {
    const repository = buildRepository();
    const useCase = new GetDashboardReportUseCase(repository as any);

    await useCase.execute({ requesterId: 'pm-1', requesterRoles: ['PROJECT_MANAGER'] });

    expect(repository.getDashboardStats).toHaveBeenCalledWith({ ownerId: undefined });
  });

  it('returns the stats produced by the repository', async () => {
    const repository = buildRepository({ totalTasks: 5, completedTasks: 5, pendingTasks: 0, overdueTasks: 0 });
    const useCase = new GetDashboardReportUseCase(repository as any);

    const result = await useCase.execute({ requesterId: 'user-1', requesterRoles: [] });

    expect(result).toEqual({ totalTasks: 5, completedTasks: 5, pendingTasks: 0, overdueTasks: 0 });
  });
});
