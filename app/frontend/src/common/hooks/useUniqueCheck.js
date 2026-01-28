import { useState, useCallback } from 'react';
import { diningTableService } from '../../services/backend/diningTableService';
import { foodService } from '../../services/backend/foodService';
import { orderService } from '../../services/backend/orderService';
import { productService } from '../../services/backend/productService';
import { roleService } from '../../services/backend/roleService';
import { userService } from '../../services/backend/userService';


const validationRegistry = {
  diningTableName: (val) => diningTableService.checkTableNameAvailability(val),
  foodName: (val) => foodService.checkFoodNameAvailability(val),
  orderNumber: (val) => orderService.checkOrderNumberAvailability(val),
  productName: (val) => productService.checkProductNameAvailability(val),
  roleName: (val) => roleService.checkRoleNameAvailability(val),
  username: (val) => userService.checkUsernameAvailability(val),
};


export const useUniqueCheck = (resource, options = {}) => {
  const { 
    minLength = 1, 
    maxLength = 50
  } = options;

  const [isAvailable, setIsAvailable] = useState(null);
  const [isChecking, setIsChecking] = useState(false);


  const checkAvailability = useCallback(async (value, originalValue = null) => {
    
    if (originalValue && value === originalValue) {
      setIsAvailable(true);
      return true;
    }

    if (!value || value.length < minLength || value.length > maxLength) {
      setIsAvailable(null);
      return null;
    }

    try {
      setIsChecking(true);

      const checkFn = validationRegistry[resource];
      if (!checkFn) {
        console.warn('Validation function not found for resource:', resource);
        return null;
      }

      const available = await checkFn(value);
      setIsAvailable(available);
      return available;
    } 
    catch (err) {
      console.error('Error in uniqueness check:', err);
      setIsAvailable(false);
      return false;
    } 
    finally {
      setIsChecking(false);
    }
  }, [resource, minLength, maxLength]);


  return { 
    isAvailable, 
    isChecking, 
    checkAvailability, 
    setIsAvailable 
  };
};