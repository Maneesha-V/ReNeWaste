export const handleUserLogout = () => {
    localStorage.removeItem("token");
    window.location.replace("/"); 
  };
  export const handleDriverLogout = () => {
    localStorage.removeItem("token");
    window.location.replace("/driver"); 
  };
  export const handlePlantLogout = () => {
    localStorage.removeItem("token");
    window.location.replace("/waste-plant"); 
  };
  export const handleAdminLogout = () => {
    localStorage.removeItem("token");
    window.location.replace("/super-admin"); 
  };
  export const handlePlantBlock = () => {
    localStorage.removeItem("token");
    window.location.href = "/waste-plant/blocked"; 
  }
  export const handleUserBlock = () => {
    localStorage.removeItem("token");
    window.location.href = "/blocked";
  }