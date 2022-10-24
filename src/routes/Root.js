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
        <Navbar.Brand><NavLink className="navLink brand" to="/">Terra Invicta Shipbuilder</NavLink></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavDropdown title="Stats" id="basic-nav-dropdown">
                <NavDropdown.Item href="/stats/drives">Drives</NavDropdown.Item> 
                <NavDropdown.Item href="/stats/powerplants">Power Plants</NavDropdown.Item>
                <NavDropdown.Item href="/stats/radiators">Radiator</NavDropdown.Item>
                <NavDropdown.Item href="/stats/techs">Technology</NavDropdown.Item>
                <NavDropdown.Item href="/stats/hulls">Hulls</NavDropdown.Item>
                <NavDropdown.Item href="/stats/batteries">Batteries</NavDropdown.Item>
                <NavDropdown.Item href="/stats/weapons">Weapons</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="#home">Drive Eval</Nav.Link>
              <Nav.Link href="#home">Drive Optimizer</Nav.Link>
              <Nav.Link href="/buildsim">Build Sim</Nav.Link>
              <Nav.Link href="#link">Drive Detail</Nav.Link>
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
