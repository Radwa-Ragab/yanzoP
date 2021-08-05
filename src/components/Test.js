import React, { Component } from "react";
import Geocode from "react-geocode";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";

export class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false, // Hides or shows the InfoWindow
      activeMarker: {}, // Shows the active marker upon click
      selectedPlace: {}, // Shows the InfoWindow to the selected place upon a marker
    };
  }

  // componentDidMount() {
  //   Geocode.setApiKey("AIzaSyDGLV2zbFZNvPOeFtuePcisgwAbmVIsSH0");

  //   Geocode.fromLatLng("48.8583701", "2.2922926").then(
  //     (response) => {
  //       const address = response.results[0].formatted_address;
  //       console.log(address);
  //     },
  //     (error) => {
  //       console.error(error);
  //     }
  //   );
  // }

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
    });

  onClose = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
      });
    }
  };

  render() {
    const mapStyles = {
      width: "100%",
      height: "100%",
    };
    return (
      <div>
        <Map
          google={this.props.google}
          
          zoom={14}
          style={mapStyles}
          initialCenter={{
            lat: 48.8583701,
            lng: 2.2922926,
          }}
        >
          <Marker
            onClick={this.onMarkerClick}
            name={"Paris"}
          />
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
            onClose={this.onClose}
          >
            <div>
              <h4>{this.state.selectedPlace.name}</h4>
            </div>
          </InfoWindow>
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyDGLV2zbFZNvPOeFtuePcisgwAbmVIsSH0",
})(Test);
