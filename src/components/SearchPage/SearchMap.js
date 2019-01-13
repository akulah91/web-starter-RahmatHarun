import React, { Component } from 'react';

import GoogleMapReact from 'google-map-react';
import {Button, Typography} from '@material-ui/core';

import { LocationOn} from '@material-ui/icons';
import {GOOGLE_MAP_API} from '../../utils/constants'

const AnyReactComponent = ({ text, onClick, className}) => (
  <Button onClick={onClick} className="gpsLink">
    <LocationOn className={className} color={className ? 'inherit' : 'secondary'} /><Typography variant="caption">{text}</Typography>
  </Button>
);

export default class SearchMap extends Component {
  render() {
    const {data, currentLoc, nav} = this.props;
    const defaultindex = data.length > 5 ? Math.floor(data.length / 2) : 0;
    return (
      <GoogleMapReact
        bootstrapURLKeys={{ key: GOOGLE_MAP_API}}
        defaultCenter={{
          lat: data[defaultindex].lat,
          lng: data[defaultindex].lon
        }}
        defaultZoom={15}
      >
        {currentLoc
          && (
            <AnyReactComponent
              lat={currentLoc.lat}
              lng={currentLoc.lon}
              className="currentLocation"
              text="You are here"
            />
          )}
        {data.map((r) => {
          return (
            <AnyReactComponent
              lat={r.lat}
              lng={r.lon}
              text={r.title}
              onClick={() => { nav.push(`/rest/${r.id}`); }}
            />
          );
        })}
      </GoogleMapReact>

    );
  }
}
