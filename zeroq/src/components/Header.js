const { Fragment } = require("react");

/*jshint esversion: 6 */
import React,{Fragment} from 'react';
import logo from '../../assets/images/assets_logo.png';
const Header = () => {
  return Fragment(
      <header className="App-header">
        <img className="img-fluid" src={logo} alt="" />
      </header>
  );
};

export default Header;
