import './About.css'
import changelog from '../data/changelog.json'
import ListGroup from 'react-bootstrap/ListGroup'

export default function About (props) {
  let changelogBlock = changelog.map(entry => (
    <ListGroup.Item
      className="d-flex justify-content-between align-items-start"
    >
      <div className="ms-2 me-auto">
        <div className="fw-bold">{entry.title} ({entry.date})</div>
        <ul>
          {entry.content.map(item => <li>{item}</li>)}
        </ul>
      </div>
    </ListGroup.Item>
  ))
  return (
    <div className="about">
      <h4>About</h4>
      <div className="headingParagraphs">
        <p>Terra Invicta ShipBuilder is a fan resource deployed on Github Pages. It is in no way assosiated with Pavonis Interactive or Hooded Horse.</p>
        <p>This website is build with react, react-bootstrap, and recharts, </p>
        <p>The data used website is reflective of game version <b>0.3.35</b></p>
        <p>This resource is curently experimental and new features are being added before release. For a list of planned features, check the changelog. TODO features are listed in order of priority.</p>
        <p>This resource is written by @WolfearX#1363 on discord. Feel free to DM me any feature suggestion or bug reports via Discord</p>
      </div>
      <hr/>
      <h3>Changelog</h3>
      <ListGroup as="ul" className="changelog">
        {changelogBlock}
      </ListGroup>
    </div>
  )
}