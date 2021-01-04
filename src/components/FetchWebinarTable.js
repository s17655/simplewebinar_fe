import React from "react";
import { Container, Table } from "reactstrap";
import { getObjects } from "../functions/APIfunctions";

class FetchWebinarTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonResponse: null,
    };
    this.renderTableData = this.renderTableData.bind(this);
  }

  async componentDidMount() {
    var finalURL = (this.props.login==null)?this.props.url:this.props.url+"/"+this.props.login;
    var resp = await getObjects(
      finalURL
    );
    this.setState({ jsonResponse: resp });
    }

  renderTableData(jsonFile) {
    return jsonFile.map((webinar, index) => {
      const { topic, teacher, date, code } = webinar; //destructuring
      return (
        <tr key={code}>
          <td>{topic}</td>
          <td>{teacher}</td>
          <td>{date}</td>
          <td>{code}</td>
        </tr>
      );
    });
  }

  render() {
    return (
      <Container>
        <Table striped hover>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Teacher</th>
              <th>Date</th>
              <th>Code</th>
            </tr>
          </thead>
          <tbody>{(this.state.jsonResponse!=null)&&this.renderTableData(this.state.jsonResponse)}</tbody>
        </Table>
      </Container>
    );
  }
}

export default FetchWebinarTable;