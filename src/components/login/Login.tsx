import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from '@material-ui/core';
import * as React from 'react';
import * as rest from "../../rest/interface";
import '../../styles.css';
import { UserContext, UserContextConsumer } from '../app/App'

interface State {
  open: boolean;
  submitted: boolean
  username: string
  password: string
  token: string
  errorText: string
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
      errorText: ""
    };
  }

  public render() {

    const LoginButton = () => (
      <UserContextConsumer>
        {userContext => userContext && (
          <Button onClick={this.handleClickOpen} color="inherit" className="login-button" id="login-button">
            {userContext.username === "" ? "Log In" : "Log Out"}
          </Button>
        )}
      </UserContextConsumer>
    )

    return (
      <div>
        <LoginButton />
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
            <Typography color="error">
              {this.state.errorText}
            </Typography>
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
    const currentContext = this.context;
    console.log(currentContext);
    if (currentContext.username === "") {
      this.setState({
        open: true,
      });
    } else {
      this.props.updateUsername("");
    }
  }

  private handleClickClose = () => {
    this.setState({
      open: false,
      username: "",
      password: "",
      errorText: ""
    });
  }

  private handleClickSubmit = () => {
    this.props.client.getToken((err, resp, body) => {
      if (err || resp.statusCode >= 300) {
        if (resp.statusCode === 401) {
          this.setState({
            errorText: "Invalid username or password"
          });
        } else {
          console.log("got error " + err + " with status code " + resp.statusCode);
        }
      } else {
        this.props.updateUsername(this.state.username);
        this.setState({
          open: false,
          submitted: true,
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

console.log("logincontext " + JSON.stringify(UserContext));
Login.contextType = UserContext;

export default Login;