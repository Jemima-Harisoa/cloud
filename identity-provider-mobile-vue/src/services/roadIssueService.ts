import apiClient from './client';

const ROAD_ISSUES_API = '/road-issues';

const roadIssueService = {
  getAllIssues: async () => {
    const response = await apiClient.get(ROAD_ISSUES_API);
    return response.data;
  },

  getIssuesByStatus: async (status: string) => {
    const response = await apiClient.get(`${ROAD_ISSUES_API}?status=${status}`);
    return response.data;
  },

  getIssuesByReporter: async (reporterId: number) => {
    const response = await apiClient.get(`${ROAD_ISSUES_API}?reporterId=${reporterId}`);
    return response.data;
  },

  createIssue: async (reporterId: number | undefined, issueData: any) => {
    const response = await apiClient.post(`${ROAD_ISSUES_API}?reporterId=${reporterId}`, issueData);
    return response.data;
  },

  getStatistics: async () => {
    const response = await apiClient.get(`${ROAD_ISSUES_API}/stats`);
    return response.data;
  },
  syncWithFirebase: async () => {
    const response = await apiClient.post(`${ROAD_ISSUES_API}/sync`);
    return response.data;
  },
  updateIssue: async (id: number, issueData: any) => {
    const response = await apiClient.put(`${ROAD_ISSUES_API}/${id}`, issueData);
    return response.data;
  }
};

export default roadIssueService;
