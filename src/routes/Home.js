import './Home.css'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { ListGroup, ListGroupItem } from 'react-bootstrap';

function Home() {
  return (
    <div className="home">
      <br/>
      <Row className='col-12 homeContent'>
        <Col className="col-12 col-md-6 leftpane">
          <p>Welcome to Terra Invicta Shipbuilder!</p>
          <p>Navigate to different parts of this resource via the nav on top of the page.</p>
          <p>This resource lets you try building ships out of game with all modules unlocked, helping you decide for yourself what technologies you should prioritize.</p>
          <p>This tool was originally designed to primarily evaluate drives, power plants, and radiators, and offensive calculations for ships are not avaliable at the moment.</p>
        </Col>
        <Col className="col-12 col-md-6">
          <h6>Need some more help on shipbuilding?</h6>
          <ListGroup className="resourceList">
            <ListGroupItem>
              Check out this <a href="https://www.reddit.com/r/TerraInvicta/comments/y4p5kv/guide_how_to_defeat_an_alien_invasion_in_10_easy/">reddit post by u/QuestionableCounsel</a> on shipbuilding!
            </ListGroupItem>
            <ListGroupItem>
              Visit the <a href="https://hoodedhorse.com/wiki/Terra_Invicta/Spaceships">Official Terra Invicta Wiki</a> on shipbuilding!
            </ListGroupItem>
            <ListGroupItem>
              Consult the <a href="https://rookiv.github.io/terra-invicta/">Interactive Tech Tree Website</a> by rookiv!
            </ListGroupItem>
            <ListGroupItem>
              Ask on the <a href="https://discord.gg/Hnzywg5uBf">Pavonis Interactive Discord</a> strategy/shipbuilding channels!
            </ListGroupItem>
          </ListGroup>
        </Col>
        <br/>
        <div>
          <h5>What is Terra Invicta?</h5>
          <p className="quote">"From the creators of Long War, an alien invasion has fractured humanity into seven ideological factions each with a unique vision for the future. Lead your chosen faction to take control of Earth’s nations, expand across the Solar System, and battle enemy fleets in tactical combat."</p>
          <p>Terra Invicta is a science fiction grand strategy video game developed by Pavonis Interactive and published by Hooded Horse for Windows that was released into early access in September 2022.</p>
          <p>Learn more about Terra Invicta on its <a href="https://store.steampowered.com/app/1176470/Terra_Invicta/">steam store page</a> or its <a href="https://www.gog.com/en/game/terra_invicta">GOG store page</a></p>
        </div>
      </Row>
    </div>
  );
}

export default Home;