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
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClickClose = this.handleClickClose.bind(this);
    this.handleClickSubmit = this.handleClickSubmit.bind(this);
    this.state = {
      open : false,
      submitted : false,
      username : "",
      password : "",
    };
  }

  public handleClickOpen() : void {
    this.setState({
      open : true,
    });
  }

  public handleClickClose(): void {
    this.setState({
      open : false,
    });
  }

  public handleClickSubmit(): void {
    this.setState({
      open : false,
      submitted : true,
    });
  }

  public render() {
    return (
      <div>
        <Button onClick={this.handleClickOpen} className="login-button">
          Log In
        </Button>
        <Dialog open={this.state.open} onClose={this.handleClickClose}>
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
              onChange={this.updateSingleField("username")}
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
              onChange={this.updateSingleField("password")}
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
 
  private updateSingleField = (fieldName:string) => {
    return (value:React.ChangeEvent<HTMLInputElement>) => {
      const newState = Object.assign({}, this.state);
      newState[fieldName] = value.target.value;
      this.setState(newState);
    }
  }
  
}

export default Login;