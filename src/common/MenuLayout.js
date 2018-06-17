import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ShortUrls from '../short-urls/ShortUrls';
import AsideMenu from './AsideMenu';

export default function MenuLayout() {
  return (
    <div className="row">
      <AsideMenu />
      <div className="col-md-10 offset-md-2 col-sm-9 offset-sm-3">
        <Switch>
          <Route exact
                 path="/server/:serverId/list-short-urls/:page"
                 component={ShortUrls}
          />
        </Switch>
      </div>
    </div>
  );
}
