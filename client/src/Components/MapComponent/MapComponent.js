import React, { Component } from 'react';
import { compose, withProps, lifecycle } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, DirectionsRenderer, Marker } from 'react-google-maps';

const MapWithADirectionsRenderer = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyDlM3xx-1-HZtT6P1Ofa4U8YO75mQ9xl7s&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `700px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    componentDidMount() {
      const DirectionsService = new window.google.maps.DirectionsService();

      DirectionsService.route({
        origin: new window.google.maps.LatLng(this.props.startLat, this.props.startLong),
        destination: new window.google.maps.LatLng(this.props.endLat, this.props.endLong),
        travelMode: window.google.maps.TravelMode.DRIVING,
      }, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result,
          });
          console.log(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      });
    }
  })
)(props => (
  <GoogleMap
    defaultZoom={10}
    defaultCenter={{ lat: props.startLat, lng: props.startLong }}
  >
    {props.isMarkerShown && <Marker position={{ lat: props.startLat, lng: props.startLong }} />}
    {props.directions && <DirectionsRenderer directions={props.directions} />}
  </GoogleMap>
));

class MapComponent extends Component {
  render() {
    return (
      <div className="map-c" style={{ height: '700px' }}>
        <MapWithADirectionsRenderer
          startLat={this.props.startLat}
          startLong={this.props.startLong}
          endLat={this.props.endLat}
          endLong={this.props.endLong}
        />
      </div>
    );
  }
}

export default MapComponent;
