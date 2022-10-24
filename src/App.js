import './App.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function App() {
  return (
    <div className="App">
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand onClick={() => console.log('abcv')} href="#home">Terra Invicta Shipbuilder</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavDropdown title="Stats" id="basic-nav-dropdown">
                <NavDropdown.Item href="stats/drive">Drive</NavDropdown.Item>
                <NavDropdown.Item href="stats/reactor">Reactor</NavDropdown.Item>
                <NavDropdown.Item href="stats/radiator">Radiator</NavDropdown.Item>
                <NavDropdown.Item href="stats/tech">Technology</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="#home">Drive Eval</Nav.Link>
              <Nav.Link href="#home">Drive Optimizer</Nav.Link>
              <Nav.Link href="#home">Build Sim</Nav.Link>
              <Nav.Link href="#link">Drive Detail</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default App;