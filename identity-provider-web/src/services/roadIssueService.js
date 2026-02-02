import apiClient from './client';

const ROAD_ISSUES_API = '/road-issues';

const roadIssueService = {
  getAllIssues: async () => {
    const response = await apiClient.get(ROAD_ISSUES_API);
    return response.data;
  },

  getIssuesByStatus: async (status) => {
    const response = await apiClient.get(`${ROAD_ISSUES_API}?status=${status}`);
    return response.data;
  },

  getIssuesByReporter: async (reporterId) => {
    const response = await apiClient.get(`${ROAD_ISSUES_API}?reporterId=${reporterId}`);
    return response.data;
  },

  getIssueById: async (id) => {
    const response = await apiClient.get(`${ROAD_ISSUES_API}/${id}`);
    return response.data;
  },

  createIssue: async (reporterId, issueData) => {
    const response = await apiClient.post(`${ROAD_ISSUES_API}?reporterId=${reporterId}`, issueData);
    return response.data;
  },

  updateIssue: async (id, issueData) => {
    const response = await apiClient.put(`${ROAD_ISSUES_API}/${id}`, issueData);
    return response.data;
  },

  deleteIssue: async (id) => {
    await apiClient.delete(`${ROAD_ISSUES_API}/${id}`);
  },

  getStatistics: async () => {
    const response = await apiClient.get(`${ROAD_ISSUES_API}/stats`);
    return response.data;
  },

  syncWithFirebase: async () => {
    const response = await apiClient.post(`${ROAD_ISSUES_API}/sync`);
    return response.data;
  },

  markAsSynced: async (id, firebaseId) => {
    const response = await apiClient.post(`${ROAD_ISSUES_API}/${id}/mark-synced?firebaseId=${firebaseId}`);
    return response.data;
  },
};

export default roadIssueService;
