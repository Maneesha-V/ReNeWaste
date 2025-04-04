const Footer = () => {
    return (
      <footer className="bg-green-100 text-dark text-center p-4">
        <div className="container mx-auto">
          © {new Date().getFullYear()} Waste Management System
        </div>
      </footer>
    );
  };
  export default Footer;