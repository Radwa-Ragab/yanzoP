import React, { Component } from "react";

import { Container, Row, Col } from "react-bootstrap";
import '../../style-sheets/products.css'
class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // console.log(this.state.startDate,this.state.endDate)
    return (
      <div>
        <Container
          style={{ marginTop: "80px" }}
          className="py-3"
        >
          <Row>
            <Col className="p-4 mb-4" style={{ textAlign: "center" }} sm={12}>
              <p className='link1'>All Rights Reserved by <a className='linkk' href="https://div-systems.com/" target="_blank" rel="noreferrer">Div Systems.</a></p>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Footer;
