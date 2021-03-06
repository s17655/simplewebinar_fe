import React from "react";
import { Button, Form, FormGroup, Label, Input, Container, Alert } from "reactstrap";
import { submitPost, showError, showOk } from "../functions/APIfunctions.js";
import { isValiEmail, checkPassword} from "../functions/otherFunctions.js";
import MyModal from "../components/MyModal.js";

class SignupForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: true,
      password:"",
      password2:"",
      email:"",
      login:"",
      passwordMatch:true,
      passwordValid:false,
    };
    this.sendForm = this.sendForm.bind(this);
    this.contentx = [];
    this.handleInputChange=this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const id = target.id;
    this.setState({
      [id]: value},()=>{this.setState({
      passwordMatch: this.state.password===this.state.password2,
      passwordValid: checkPassword(this.state.password)})
    })
  }

  async sendForm() {
    var success,
      textBody,
      redirect = false;
    const myForm = document.getElementById("signupForm");
    const formData = new FormData(myForm);

    let response = await submitPost(
      formData,
      null,
      "http://localhost:58870/api/simplewebinar/signup"
    );

    if (response.ok) {
      success = true;
      textBody = await showOk(response);
    } else {
      success = false;
      textBody = await showError(response);
    }

    var newModal = (
      <MyModal
        key={Date.now()}
        isSuccess={success}
        body={textBody}
        redirectToHome={redirect}
      />
    );
    this.contentx.push(newModal);
    this.setState((state) => ({
      isModalOpen: true,
    }));
  }

  render() {
    return (
      <div>
        <Container>
          <Form id="signupForm">
            <FormGroup>
              <Label for="Email">Email</Label>
              <Input
                type="email"
                name="Email"
                id="email"
                placeholder="Add email"
                required
                onChange = {this.handleInputChange}
                value={this.state.email}
              />
            </FormGroup>
            <FormGroup>
              <Label for="Login">Login</Label>
              <Input
                type="text"
                name="Login"
                id="login"
                placeholder="Add login"
                required
                onChange = {this.handleInputChange}
                value={this.state.login}
              />
            </FormGroup>
            <FormGroup>
              <Label for="Password">Password</Label>
              <Input
                type="password"
                name="Password"
                id="password"
                placeholder="Add password"
                required
                onChange = {this.handleInputChange}
                value={this.state.password}
              />
              {!(this.state.passwordValid)&&(<Alert color="danger">
                Password is invalid!<br/>
                Password must constist of at list 8 signs. At least on capital letter, small letter and number.
              </Alert>)}
            </FormGroup>
            <FormGroup>
              <Label for="Password2">Repeat password</Label>
              <Input
                type="password"
                name="Password2"
                id="password2"
                placeholder="Repeat password"
                required
                onChange = {this.handleInputChange}
                value={this.state.password2}
              />
              {!(this.state.passwordMatch)&&(<Alert color="danger">
                Passwords don't match!
              </Alert>)}
            </FormGroup>
            <Button
              color="info"
              style={{ float: "right" }}
              onClick={this.sendForm}
              disabled=
              {this.state.email.length<1||this.state.login.length<1
                ||this.state.password.length<1||this.state.password2.length<1
                ||!(this.state.passwordMatch)||!(this.state.passwordValid)
                ||!(isValiEmail(this.state.email))}
            >
              Sign up
            </Button>
          </Form>
        </Container>
        <div>{this.state.isModalOpen ? this.contentx : null}</div>
      </div>
    );
  }
}

export default SignupForm
