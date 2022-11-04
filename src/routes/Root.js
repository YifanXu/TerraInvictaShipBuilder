import './Root.css';
import { Outlet, NavLink } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom'

import logo from '../data/websitelogo.png'

function Root() {
  return (
    <div className="App">
      <Navbar bg="light" expand="lg">
        <Container>
        <Navbar.Brand>
            <img
              alt=""
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            <NavLink className="navLink brand" as={Link} to="/">Terra Invicta Shipbuilder</NavLink>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavDropdown title="Stats" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/stats/drives">Drives</NavDropdown.Item> 
                <NavDropdown.Item as={Link} to="/stats/powerplants">Power Plants</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/stats/radiators">Radiator</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/stats/techs">Technology</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/stats/hulls">Hulls</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/stats/batteries">Batteries</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/stats/weapons">Weapons</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/stats/utility">Utility</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/stats/armor">Armor</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link as={Link} to="/optimizier" disabled>Drive Optimizer</Nav.Link>
              <Nav.Link as={Link} to="/buildsim">Build Sim</Nav.Link>
              <Nav.Link as={Link} to="/about">About</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className='mainContent'>
        <Outlet/>
      </div>
    </div>
  );
}

export default Root;