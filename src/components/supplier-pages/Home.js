import React, { Component } from "react";
import { Container, Row, Col, } from "react-bootstrap";
import "../../style-sheets/home.css";
import ProgressSupplier from "../sections/ProgressSupplier";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
 
  render() {
    // console.log(this.state.startDate,this.state.endDate)
    return (
      <div>
        <Container style={{marginTop:'80px',marginLeft:'250px'}} className="pt-3">
          <Row>
            <Col className="p-4 mb-4" style={{ textAlign: "initial" }} sm={12}>
              <h2>
                {" "}
                <i class="fas fa-home pr-2"></i> Home
              </h2>
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={12}>
            <ProgressSupplier/>

            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Home;
