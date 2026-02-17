import React from "react";

function Footer() {
  return (
    <footer className="mt-8 pt-4">
      <div className="flex justify-between items-center">
        <p className="text-center mt-4 text-gray-500 text-xs">
          &copy; 2024 E-Mart. All rights reserved.
        </p>

        <div className="flex space-x-4  text-gray-800 font-medium">
          <p className="text-center mt-4  text-xs ">Privacy Policy</p>
          <p className="text-center mt-4 text-xs">Terms & Conditions</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
