import React, { Component } from "react";
import { Map, Marker, GoogleApiWrapper, InfoWindow } from "google-maps-react";
import { Container } from "react-bootstrap";
export class ViewBranchMap extends Component {
  state = {
    showingInfoWindow: false, // Hides or shows the InfoWindow
    activeMarker: {}, // Shows the active marker upon click
    selectedPlace: {},
    markers: [
      {
        name: "Current position",
        position: {
          lat: 40.43789768145553,
          lng: -3.690751953125,
        },
      },
    ],
  };

  onMarkerDragEnd = (coord, index) => {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();
    // console.log(lat, lng);
    this.setState((prevState) => {
      const markers = [...this.state.markers];
      markers[index] = { ...markers[index], position: { lat, lng } };
      return { markers };
    });
  };

  

  componentDidUpdate(prevProps) {
    if (prevProps.location.lat !== this.props.location.lat) {
      // console.log("changeeeeee");
      this.setState({
        center: {
          lat: this.props.location.lat,
          lng: this.props.location.lon,
        },
      });
    }
  }

  render() {
    // console.log(this.props);
    return (
      <Container
        style={{
          width: "100%",
          height: "30vh",
        }}
      >
        {this.props.location ? (
          <Map
            google={this.props.google}
            zoom={14}
            // style={mapStyles}
            initialCenter={{
              // lat: -1.2884,
              // lng: 36.8233
              lat: this.props.location.lat,
              lng: this.props.location.lon,
            }}
          >
            <Marker
              onClick={this.onMarkerClick}
              name={"Kenyatta International Convention Centre"}
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
          // <h1>here</h1>
        ) : (
          // <Map
          //   google={this.props.google}
          //   zoom={14}
          //   // style={mapStyles}
          //   initialCenter={{
          //     lat: -1.2884,
          //     lng: 36.8233,
          //     // lat: this.props.location.lat,
          //     // lng: this.props.location.lon
          //   }}
          // >
          //   <Marker
          //     onClick={this.onMarkerClick}
          //     name={"Kenyatta International Convention Centre"}
          //   />
          //   <InfoWindow
          //     marker={this.state.activeMarker}
          //     visible={this.state.showingInfoWindow}
          //     onClose={this.onClose}
          //   >
          //     <div>
          //       <h4>{this.state.selectedPlace.name}</h4>
          //     </div>
          //   </InfoWindow>
          // </Map>
          null
        )}
      </Container>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyDGLV2zbFZNvPOeFtuePcisgwAbmVIsSH0",
})(ViewBranchMap);