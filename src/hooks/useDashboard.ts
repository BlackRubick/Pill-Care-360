// hooks/useDashboard.js
import { useState, useEffect } from 'react';
import apiService from '../services/api';

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalPatients: 0,
      activeTreatments: 0,
      todayDoses: 0,
      pendingAlerts: 0,
      complianceRate: 0
    },
    recentActivity: [],
    upcomingDoses: [],
    loading: true,
    error: null
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    loadDashboardData();
    loadUserData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setDashboardData(prev => ({ ...prev, loading: true, error: null }));

      // Cargar datos en paralelo
      const [stats, recentActivity, upcomingDoses] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getRecentActivity(),
        apiService.getUpcomingDoses()
      ]);

      setDashboardData({
        stats,
        recentActivity,
        upcomingDoses,
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setDashboardData(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  const loadUserData = async () => {
    try {
      // Primero intentar obtener del localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      // Luego validar con el servidor
      const currentUser = await apiService.getCurrentUser();
      setUser(currentUser);
      localStorage.setItem('user', JSON.stringify(currentUser));

    } catch (error) {
      console.error('Error loading user data:', error);
      // Si falla, usar datos del localStorage o redirigir a login
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        apiService.logout();
      }
    }
  };

  const refreshData = () => {
    loadDashboardData();
  };

  const handleLogout = () => {
    apiService.logout();
  };

  return {
    ...dashboardData,
    user,
    refreshData,
    handleLogout
  };
};