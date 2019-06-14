import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@material-ui/core';
import * as React from 'react';
import * as rest from "../../rest/interface";
import '../../styles.css';

interface State {
  open : boolean;
  submitted : boolean
  username : string
  password : string
}

class Props {
  public client: rest.Evergreen;
}

export class Login extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      open : false,
      submitted : false,
      username : "",
      password : "",
    };
  }

  public render() {
    return (
      <div>
        <Button onClick={this.handleClickOpen} color="inherit" className="login-button" id="login-button">
          Log In
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
              type="string"
              fullWidth={true}
              required={true}
              onChange={this.updateSingleField(this.state, "password")}
              value={this.state.password}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClickClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleClickSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  private handleClickOpen = () => {
    this.setState({
      open : true,
    });
  }

  private handleClickClose = () => {
    this.setState({
      open : false,
      username: "",
      password: "",
    });
  }

  private handleClickSubmit = () => {
    this.props.client.getToken((err, resp, body) => {
      if (err || resp.statusCode >= 300) {
        console.log("got error " + err + " with status " + status);
        return;
      }
      console.log(resp.request.response.rawHeaders);
    }, this.state.username, this.state.password);
    this.setState({
      open : false,
      submitted : true,
    });
  }
 
  private updateSingleField = <T, K extends keyof T>(state: T, key: K) => {
    return (value:React.ChangeEvent<HTMLInputElement>) => {
      const newState = Object.assign({}, state);
      newState[key] = value.target.value as any;
      this.setState(newState);
    }
  }
  
}

export default Login;