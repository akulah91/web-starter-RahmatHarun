import React from 'react';
import {
  Typography,
  List, ListItem,
  Card, CardContent, CardMedia, Button,
} from '@material-ui/core';

import moment from 'moment';
import { Star, LocationOn, DirectionsWalk} from '@material-ui/icons';

const RestList = (props) => {
  const{data, nav} = props;
  return (
    <List className="searchListBox">
      {data.map((r) => {
        return <RestaurantCard data={r} nav={nav} />;
      })}
    </List>
  );
};
export default RestList;

const RestaurantCard = ({ data, nav}) => {
  return (
    <ListItem style={{ display: 'flex', flexDirection: 'column' }}>
      <Card style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <CardContent style={{ flex: '1 0 auto', width: '60%' }}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <LocationOn color="secondary" />
            <Button
              style={{cursor: 'pointer'}}
              onClick={() => {
                nav.push(`/rest/${data.id}`);
              }}
            >
              <Typography component="h6" variant="h6">
                {data.title || 'Restaurant Name'}
              </Typography>
            </Button>
          </div>
          <Typography variant="subtitle1" color="secondary">
            {data.cuisine || 'Category'}
          </Typography>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <Star color="secondary" />
            <Typography variant="body2">
              {data.references.length > 0 ? (
                `Featured in ${data.references[0].site_name}... +${data.references.length}`
              ) : 'Waiting for upcoming feature'}
            </Typography>
          </div>
        </CardContent>
        {data.images && (
          <CardMedia
            style={{ width: '40%' }}
            image={data.images[0]}
            title={data.title}
          />
        )}
      </Card>
      <List
        className="itemDetail"
        style={{
          display: 'flex',
          flexDirection: 'row',
          padding: 0,
          width: '100%'
        }}
      >
        <ListItem>
          <Typography variant="caption" color="secondary">
            {data.open_closed ? data.open_closed : (
              `Closes at ${getCloseHour(data.hours)}`
            )}
          </Typography>

        </ListItem>
        <ListItem>
          <Typography variant="caption" color="secondary">
            {data.distance ? `${data.distance.toFixed(2)}  miles away` : 'distance not calculated'}
          </Typography>
        </ListItem>
        <ListItem>
          <DirectionsWalk color="secondary" />
          <Typography variant="caption">
            {`${getWalkTime(data.distance)} minutes`}
          </Typography>
        </ListItem>
        <ListItem> <Star color="secondary" />
          <Typography variant="caption">
            {data.rating} /5
          </Typography>
        </ListItem>
      </List>
    </ListItem>
  );
};

const getCloseHour = (data) => {
  const day = moment().format('ddd').toLocaleLowerCase();
  if(data) {
    const time = data.split(' ').find((element) => {
      return element.split(':')[0].toLocaleLowerCase() === day;
    });
    return moment(time.substr(-4), 'HHmm').format('h:mm a');
  }

  return '';
};

const getWalkTime = (dist) => {
  // refference https://www.verywellfit.com/convert-miles-to-kilometers-and-walking-time-3876685
  // Easy pace: 20 minutes per mile or 12.5 minutes per kilometer.
  return Math.floor(20 * dist);
};
