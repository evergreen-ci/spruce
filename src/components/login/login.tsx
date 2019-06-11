import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@material-ui/core';
import * as React from 'react';
import * as rest from "../../rest/interface";
import '../../styles.css';

interface State {
  APIClient: rest.Evergreen;
  open : boolean;
  submitted : boolean
  username : string
  password : string
}

class Props {
}

export class Login extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClickClose = this.handleClickClose.bind(this);
    this.handleClickSubmit = this.handleClickSubmit.bind(this);
    this.state = {
      APIClient: rest.EvergreenClient("admin", "e4f2c40463dcade5248d36434cb93bac", "http://localhost:8080/api"),
      open : false,
      submitted : false,
      username : "",
      password : "",
    };
  }

  public handleClickOpen() : any{
    this.setState({
      open : true,
    });
  }

  public handleClickClose(): any {
    this.setState({
      open : false,
    });
  }

  public handleClickSubmit(): any {
    console.log(this.state.username);
    this.setState({
      open : false,
      submitted : true,
    });
  }

  public render() {
    return (
      <div>
        <Button onClick={this.handleClickOpen}>
          Log In
        </Button>
        <Dialog open={this.state.open} onClose={this.handleClickClose} aria-labelledby="form-dialog-title">
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