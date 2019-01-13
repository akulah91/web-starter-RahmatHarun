import React, { Component } from 'react';

import { Query } from 'react-apollo';
import { CircularProgress, AppBar, Toolbar, Button, Typography, IconButton } from '@material-ui/core';
import { Tune, List as ListIcon, Map } from '@material-ui/icons';
import { RESTAURANT_SEARCH_QUERY } from '../../graphql/queries';
import RestList from './RestList';

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: 'chicago',
    };
  }

  render() {
    const { address} = this.state;
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
              <div>
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
