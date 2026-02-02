import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import roadIssueService from '../services/roadIssueService';
import '../styles/Dashboard.css';

function ManagerDashboard() {
  const navigate = useNavigate();
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [allIssues, setAllIssues] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'MANAGER') {
      navigate('/dashboard');
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [blockedUsersData, issuesData, statsData] = await Promise.all([
        authService.getBlockedUsers(),
        roadIssueService.getAllIssues(),
        roadIssueService.getStatistics(),
      ]);
      
      setBlockedUsers(blockedUsersData);
      setAllIssues(issuesData);
      setStats(statsData);
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      await authService.unblockUser(userId);
      setBlockedUsers(blockedUsers.filter(u => u.id !== userId));
      alert('Utilisateur débloqué avec succès');
    } catch (err) {
      alert('Erreur lors du déverrouillage de l\'utilisateur');
    }
  };

  const handleSyncFirebase = async () => {
    try {
      await roadIssueService.syncWithFirebase();
      alert('Synchronisation réussie avec Firebase');
      loadData();
    } catch (err) {
      alert('Erreur lors de la synchronisation');
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="manager-dashboard">
      <header className="dashboard-header">
        <h1>Tableau de Bord Manager</h1>
        <div className="header-actions">
          <span>{currentUser?.email}</span>
          <button onClick={handleLogout} className="btn btn-secondary">
            Déconnexion
          </button>
        </div>
      </header>

      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Aperçu
        </button>
        <button
          className={`tab-btn ${activeTab === 'issues' ? 'active' : ''}`}
          onClick={() => setActiveTab('issues')}
        >
          Signalements
        </button>
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Utilisateurs Bloqués
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            {stats && (
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total des Signalements</h3>
                  <p className="stat-number">{stats.totalIssues}</p>
                </div>
                <div className="stat-card">
                  <h3>Surface Totale</h3>
                  <p className="stat-number">{stats.totalSurfaceArea?.toFixed(0)} m²</p>
                </div>
                <div className="stat-card">
                  <h3>Budget Total</h3>
                  <p className="stat-number">{(stats.totalBudget / 1000000)?.toFixed(1)}M Ar</p>
                </div>
                <div className="stat-card">
                  <h3>Avancement</h3>
                  <p className="stat-number">{stats.completionPercentage?.toFixed(1)}%</p>
                </div>
              </div>
            )}

            <div className="status-breakdown">
              <h3>Répartition par Statut</h3>
              <div className="status-items">
                <div className="status-item">
                  <span className="status-badge new"></span>
                  <span>Nouveaux</span>
                  <span className="count">{stats?.newIssuesCount}</span>
                </div>
                <div className="status-item">
                  <span className="status-badge inprogress"></span>
                  <span>En cours</span>
                  <span className="count">{stats?.inProgressCount}</span>
                </div>
                <div className="status-item">
                  <span className="status-badge completed"></span>
                  <span>Terminés</span>
                  <span className="count">{stats?.completedCount}</span>
                </div>
              </div>
            </div>

            <button onClick={handleSyncFirebase} className="btn btn-primary btn-large">
              🔄 Synchroniser avec Firebase
            </button>
          </div>
        )}

        {activeTab === 'issues' && (
          <div className="issues-section">
            <table className="issues-table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Statut</th>
                  <th>Surface (m²)</th>
                  <th>Budget (Ar)</th>
                  <th>Entreprise</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {allIssues.map(issue => (
                  <tr key={issue.id}>
                    <td>{issue.title}</td>
                    <td>
                      <span className={`status-badge ${issue.status.toLowerCase()}`}>
                        {issue.status}
                      </span>
                    </td>
                    <td>{issue.surfaceArea?.toFixed(0)}</td>
                    <td>{(issue.budget / 1000000)?.toFixed(1)}M</td>
                    <td>{issue.company || '-'}</td>
                    <td>{new Date(issue.createdAt).toLocaleDateString('fr-FR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-section">
            <h3>Utilisateurs Bloqués ({blockedUsers.length})</h3>
            {blockedUsers.length === 0 ? (
              <p className="empty-state">Aucun utilisateur bloqué</p>
            ) : (
              <div className="users-list">
                {blockedUsers.map(user => (
                  <div key={user.id} className="user-card">
                    <div className="user-info">
                      <h4>{user.firstName} {user.lastName}</h4>
                      <p>{user.email}</p>
                      <small>Compte créé le {new Date(user.createdAt).toLocaleDateString('fr-FR')}</small>
                    </div>
                    <button
                      onClick={() => handleUnblockUser(user.id)}
                      className="btn btn-success"
                    >
                      🔓 Débloquer
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagerDashboard;
