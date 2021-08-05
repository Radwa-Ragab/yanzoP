import React, { Component } from "react";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";
import { Container } from "react-bootstrap";
export class GetCoordinates extends Component {
  state = {
    markers: [
      {
        name: "Current position",
        position: {
          lat: 37.77,
          lng: -122.42,
        },
      },
    ],
  };

  onMarkerDragEnd = (coord, index) => {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();
    // console.log(lat, lng);
    this.props.getCoor(lat, lng);
    this.setState((prevState) => {
      const markers = [...this.state.markers];
      markers[index] = { ...markers[index], position: { lat, lng } };
      return { markers };
    });
  };

  render() {
    return (
      <Container
        style={{
          width: "100%",
          height: "30vh",
        }}
      >
        <Map style={{width:'90%'}} google={this.props.google} zoom={14}>
          {this.state.markers.map((marker, index) => (
            <Marker
              position={marker.position}
              draggable={true}
              onDragend={(t, map, coord) => this.onMarkerDragEnd(coord, index)}
              name={marker.name}
            />
          ))}
        </Map>
      </Container>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyDGLV2zbFZNvPOeFtuePcisgwAbmVIsSH0",
})(GetCoordinates);
