import { useState, useCallback } from 'react';
import { userService } from '../../../services/backend/userService';


export const useUsernameCheck = () => {
  
  const [checkingUsername, setCheckingUsername] = useState(false);

  
  const checkUsernameAvailability = useCallback(async (username, originalUsername = null) => {

    if (originalUsername && username === originalUsername) return true;
    if (!username || username.length < 3 || username.length > 50) return false;
    
    try {
      setCheckingUsername(true);
      const available = await userService.checkUsernameAvailability(username);
      return available;
    } 
    catch (err) {
      console.error('Error checking username:', err);
      return false;
    } 
    finally {
      setCheckingUsername(false);
    }
  }, []);

  
  return {
    checkUsernameAvailability,
    checkingUsername
  };
};
