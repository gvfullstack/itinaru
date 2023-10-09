import city_names from '../../../data/city_names.js';
import state_names from '../../../data/state_names.js';

const validateTitle = (value:string) => {
    if (!value || value.trim().length < 5 || value.trim().length > 100) {
      return (false)
    }
    return (true)
}

const validateCity = (value:string) => {
    console.log("ran validateCity");
    if(value == "" || value == null || value == undefined){ 
      return
    }
    if (!city_names.includes(value.toUpperCase())) 
    {
      return (false)
    }
    return (true)
  };

const validateState = (value:string) => {
    console.log("ran validateState");
    if(value == "" || value == null || value == undefined){ 
      return
    }
    if (!state_names.includes(value.toUpperCase())) {
        return (false)
    }
    return (true)
    };

export {validateTitle, validateCity, validateState}