import React, { Component } from 'react';

import { Query } from 'react-apollo';
import { CircularProgress, AppBar, Toolbar, Button, Typography, IconButton, InputBase } from '@material-ui/core';
import { Tune, List as ListIcon, Map ,LocationOn } from '@material-ui/icons';
import SearchIcon from '@material-ui/icons/Search';
import { RESTAURANT_SEARCH_QUERY } from '../../graphql/queries';
import RestList from './RestList';
import SearchMap from './SearchMap';

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: 'chicago',
      lat: 0,
      lon: 0,
    };
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      const target = e.target;
      const value = target.value;

      if (value.length) {
        this.setState({ address: value });
      }
    }
  }

  getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('latitude', position.coords.latitude,
            'longitude', position.coords.longitude);
          this.setState({ lat: position.coords.latitude, lon: position.coords.longitude });
          this.getAddress(position.coords.latitude, position.coords.longitude);
        }, (errorMessage) => {
          console.error('An error has occured while retrieving location', errorMessage);
          this.ipLookUp();
        }
      );
    } else {
      console.log('geolocation is not enabled on this browser');
      this.ipLookUp();
    }
  }

  ipLookUp = () => {
    fetch('http://ip-api.com/json')
      .then((res) => res.json()).then((response) => {
        this.setState({ lat: response.lat, lon: response.lon });
        this.setState({ address: response.city });
      });
  }

  getAddress = (latitude, longitude) => {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBiIAghnw23k2HcviyzE6h_ForUAo84ro4`)
      .then((res) => res.json()).then((response) => {
        this.setState({ address: response.results[0].formatted_address });
      });
  }

  render() {
    const { address, lat, lon } = this.state;
    const {history} = this.props;
    return (
      // Variables can be either lat and lon OR address
      <Query
        query={RESTAURANT_SEARCH_QUERY}
        variables={{address}}
      >
        {({ loading, error, data = {} }) => {
          if (loading) {
            return <CircularProgress />;
          }

          console.log('DO SOMETHING SMART WITH THIS DATA');
          console.log('data', data);
          console.log('error', error);

          // Make sure we have data
          if (
            data.search_restaurants
            && data.search_restaurants.results
            && data.search_restaurants.results.length > 0
          ) {
            return (
              <div className="searchPage">
                <div className="searchList">
                  <AppBar position="static" color="default" className="searchListHeader">
                    <Toolbar>
                      <Typography variant="h4" className="searchListTitle">
                        Foodsy
                      </Typography>
                      <IconButton aria-label="ListIcon" color="secondary" className="rightSearchButton">
                        <ListIcon fontSize="large" />
                      </IconButton>
                      <IconButton aria-label="Map">
                        <Map fontSize="large" />
                      </IconButton>
                      <Button variant="outlined" className=" searchListButton">
                        Filter
                        <Tune />
                      </Button>

                    </Toolbar>
                  </AppBar>
                  <RestList data={data.search_restaurants.results} nav={history} />
                </div>
                <div className="searchMap">
                  <AppBar position="static" color="default" className="searchMapHeader">
                    <Toolbar> 
                      <Button color="secondary" variant="contained" className="searchButton mylocation" onClick={this.getCurrentLocation}>
                        <LocationOn /> Use my location
                      </Button>
                      <div className="searchBox">
                        <div className="searchIcon">
                          <SearchIcon />
                        </div>
                        <InputBase className="searchInput" placeholder="Search food in your area..." onKeyPress={this.handleKeyPress} />
                      </div>

                      <Button color="secondary" variant="contained" className="rightSearchButton searchButton loginbtn">
                        Log In
                      </Button>
                      <Button variant="contained" className="searchButton ">
                        Sign Up
                      </Button>
                    </Toolbar>
                  </AppBar>
                  <SearchMap
                    data={data.search_restaurants.results}
                    nav={history}
                    currentLoc={{ lat, lon }}
                  />

                </div>
              </div>
            );
          }

          // No Data Return
          return <div>No Results</div>;
        }}
      </Query>
    );
  }
}

export default SearchPage;
