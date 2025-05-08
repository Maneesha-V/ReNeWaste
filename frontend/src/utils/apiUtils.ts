export const handleUserLogout = () => {
    localStorage.removeItem("token");
    window.location.replace("/"); 
  };
  export const handleDriverLogout = () => {
    sessionStorage.removeItem("driver_token");
    window.location.replace("/driver"); 
  };
  export const handlePlantLogout = () => {
    // localStorage.removeItem("wasteplant_token");
    sessionStorage.removeItem("wasteplant_token");
    window.location.replace("/waste-plant"); 
  };
  export const handleAdminLogout = () => {
    sessionStorage.removeItem("admin_token");
    window.location.replace("/super-admin"); 
  };