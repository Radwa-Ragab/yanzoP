import React, { Component } from "react";
import { Map, Marker, GoogleApiWrapper, InfoWindow } from "google-maps-react";
import { Container } from "react-bootstrap";
export class ViewMap extends Component {
  state = {
    showingInfoWindow: false, // Hides or shows the InfoWindow
    activeMarker: {}, // Shows the active marker upon click
    selectedPlace: {},
    
    center: { lat: 50.937531, lng: 6.960278600000038 },
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

  componentDidMount() {
    this.setState({
      center: {
        lat: this.props.location.lat,
        lng: this.props.location.lon,
      },
    });
  }

  render() {
    return (
      <Container
        style={{
          width: "100%",
          height: "47vh",
          position:"relative"
        }}
      >
        {this.props.location ? (
          <Map style={{width:"90%"}}  google={this.props.google} zoom={14} center={this.state.center}>
            <Marker
              onClick={this.onMarkerClick}
              name={"Kenyatta International Convention Centre"}
              position={this.state.center}
              
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
        ) : // console.log('yes')

        // <h1>here</h1>
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
        null}
      </Container>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyDGLV2zbFZNvPOeFtuePcisgwAbmVIsSH0",
})(ViewMap);
