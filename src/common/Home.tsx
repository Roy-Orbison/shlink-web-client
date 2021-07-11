import { isEmpty, values } from 'ramda';
import { Link } from 'react-router-dom';
import { Card, Row } from 'reactstrap';
import { ExternalLink } from 'react-external-link';
import ServersListGroup from '../servers/ServersListGroup';
import { ServersMap } from '../servers/data';
import { ShlinkLogo } from './img/ShlinkLogo';
import './Home.scss';

export interface HomeProps {
  servers: ServersMap;
}

const Home = ({ servers }: HomeProps) => {
  const serversList = values(servers);
  const hasServers = !isEmpty(serversList);

  return (
    <div className="home">
      <Card className="home__main-card">
        <Row noGutters>
          <div className="col-md-5 d-none d-md-block">
            <div className="p-4">
              <ShlinkLogo />
            </div>
          </div>
          <div className="col-md-7 home__servers-container">
            <div className="p-4">
              <h1 className="home__title">Welcome!</h1>
            </div>
            <ServersListGroup embedded servers={serversList}>
              {!hasServers && (
                <div className="p-4">
                  <p className="mb-4">This application will help you manage your Shlink servers.</p>
                  <p className="text-center mb-0">
                    <Link to="/server/create" className="btn btn-outline-primary btn-lg mr-2">Add a server</Link>
                    <ExternalLink href="https://shlink.io/documentation" className="btn btn-outline-secondary btn-lg">
                      Learn more
                    </ExternalLink>
                  </p>
                </div>
              )}
            </ServersListGroup>
          </div>
        </Row>
      </Card>
    </div>
  );
};

export default Home;
