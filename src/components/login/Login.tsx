import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from '@material-ui/core';
import * as React from 'react';
import * as rest from "../../rest/interface";
import '../../styles.css';

interface State {
  open: boolean;
  submitted: boolean
  username: string
  password: string
  token: string
  buttonText: string
  hideErrorMessage: boolean
}

class Props {
  public client: rest.Evergreen;
  public updateUsername: (username: string) => void;
}

export class Login extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      open: false,
      submitted: false,
      username: "",
      password: "",
      token: "",
      buttonText: "Log In",
      hideErrorMessage: true
    };
  }

  public render() {
    return (
      <div>
        <Button onClick={this.handleClickOpen} color="inherit" className="login-button" id="login-button">
          {this.state.buttonText}
        </Button>
        <Dialog open={this.state.open} onClose={this.handleClickClose} id="login-modal">
          <DialogTitle id="form-dialog-title">Log In</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter your username and password.
            </DialogContentText>
            <TextField
              autoFocus={false}
              margin="dense"
              id="username"
              label="username"
              type="string"
              fullWidth={true}
              required={true}
              onChange={this.updateSingleField(this.state, "username")}
              value={this.state.username}
            />
            <TextField
              autoFocus={false}
              margin="dense"
              id="password"
              label="password"
              type="password"
              fullWidth={true}
              required={true}
              onChange={this.updateSingleField(this.state, "password")}
              value={this.state.password}
            />
            <div hidden={this.state.hideErrorMessage}>
              <Typography color="error">
                Invalid username or password
              </Typography>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClickClose} color="primary" id="cancel-button">
              Cancel
            </Button>
            <Button onClick={this.handleClickSubmit} color="primary" id="submit-button">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  private handleClickOpen = () => {
    if (this.state.buttonText === "Log In") {
      this.setState({
        open: true,
      });
    } else {
      this.setState({
        buttonText: "Log In"
      });
      this.props.updateUsername("");
    }
  }

  private handleClickClose = () => {
    this.setState({
      open: false,
      username: "",
      password: "",
      hideErrorMessage: true
    });
  }

  private handleClickSubmit = () => {
    this.props.client.getToken((err, resp, body) => {
      if (err || resp.statusCode >= 300) {
        if (resp.statusCode === 401) {
          this.setState({
            hideErrorMessage: false
          });
        } else {
          console.log("got error " + err + " with status code " + resp.statusCode);
        }
      } else {
        this.props.updateUsername(this.state.username);
        this.setState({
          open: false,
          submitted: true,
          buttonText: "Log Out"
        });
      }
    }, this.state.username, this.state.password);
  }

  private updateSingleField = <T, K extends keyof T>(state: T, key: K) => {
    return (value: React.ChangeEvent<HTMLInputElement>) => {
      const newState = Object.assign({}, state);
      newState[key] = value.target.value as any;
      this.setState(newState);
    }
  }

}

export default Login;