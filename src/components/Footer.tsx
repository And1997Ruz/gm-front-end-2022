import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <a className="about_dev_link" href="/aboutDev">
        О разработке
      </a>
      <p>Андрей Рузняев</p>
      <p>2022</p>
      <p>Copyright &copy;</p>
    </footer>
  );
};

export default Footer;
