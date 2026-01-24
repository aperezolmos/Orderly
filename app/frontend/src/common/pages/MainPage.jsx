import { useAuth } from '../../context/AuthContext';
import { Hero } from '../components/home/Hero';
import HomeDashboardView from '../components/home/HomeDashboardView';

const MainPage = () => {
  
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Hero />;
  }

  return <HomeDashboardView />;
};

export default MainPage;
