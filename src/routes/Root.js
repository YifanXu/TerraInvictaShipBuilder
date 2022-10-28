import './Root.css';
import { Outlet, NavLink } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import drives from '../data/drives.json'

function Root() {
  return (
    <div className="App">
      <Navbar bg="light" expand="lg">
        <Container>
        <Navbar.Brand><NavLink className="navLink brand" to="/TerraInvictaShipBuilder">Terra Invicta Shipbuilder</NavLink></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavDropdown title="Stats" id="basic-nav-dropdown">
                <NavDropdown.Item href="/TerraInvictaShipBuilder/stats/drives">Drives</NavDropdown.Item> 
                <NavDropdown.Item href="/TerraInvictaShipBuilder/stats/powerplants">Power Plants</NavDropdown.Item>
                <NavDropdown.Item href="/TerraInvictaShipBuilder/stats/radiators">Radiator</NavDropdown.Item>
                <NavDropdown.Item href="/TerraInvictaShipBuilder/stats/techs">Technology</NavDropdown.Item>
                <NavDropdown.Item href="/TerraInvictaShipBuilder/stats/hulls">Hulls</NavDropdown.Item>
                <NavDropdown.Item href="/TerraInvictaShipBuilder/stats/batteries">Batteries</NavDropdown.Item>
                <NavDropdown.Item href="/TerraInvictaShipBuilder/stats/weapons">Weapons</NavDropdown.Item>
                <NavDropdown.Item href="/TerraInvictaShipBuilder/stats/armor">Armor</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="/TerraInvictaShipBuilder/optimizer" disabled>Drive Optimizer</Nav.Link>
              <Nav.Link href="/TerraInvictaShipBuilder/buildsim">Build Sim</Nav.Link>
              <Nav.Link href="/TerraInvictaShipBuilder/about">About</Nav.Link>
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

export function loader() {
  return { drives };
}
