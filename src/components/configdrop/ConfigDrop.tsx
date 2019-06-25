import { Button, Card, CardActions, CardContent, IconButton, Snackbar } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { DropzoneArea } from 'material-ui-dropzone'
import * as React from 'react';
import { ClientConfig, ConvertToClientConfig } from '../../models/client_config';
import '../../styles.css';

class Props {
  public updateClientConfig: (configObj: ClientConfig) => void;
}

interface State {
  snackbarOpen: boolean,
  snackbarMessage: string,
  error: string
  newConfig: ClientConfig,
}

export class ConfigDrop extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      snackbarOpen: false,
      snackbarMessage: "",
      error: null,
      newConfig: null
    };
  }

  public render() {
    return (
      <div>
        <Card>
          <CardContent>
            <DropzoneArea onChange={this.handleDropAreaChange}
              dropzoneText={"Drop your config file here"}
              filesLimit={1}
              acceptedFiles={["application/json"]} />
          </CardContent>
          <CardActions>
            <Button variant="outlined" className="save" onClick={this.save()}>Save</Button>
          </CardActions>
        </Card>
        <Snackbar open={this.state.snackbarOpen} message={this.state.snackbarMessage}
          anchorOrigin={{ vertical: "bottom", horizontal: "left", }} onClose={this.onCloseSnackbar}
          action={[<IconButton key="close" color="inherit" onClick={this.onCloseSnackbar}><CloseIcon /></IconButton>,]} />
      </div>
    )
  }

  private handleDropAreaChange = (fileArray: File[]) => {
    if (fileArray.length !== 0) {
      this.readConfig(fileArray[0]);
    } else {
      this.setState({
        newConfig: null
      });
    }
  }

  private readConfig = (file: File) => {
    const reader = new FileReader();
    reader.onerror = () => {
      this.setState({
        snackbarMessage: "Failed to read config file with error " + reader.error,
        snackbarOpen: true
      });
    };
    reader.onload = () => {
      const raw = reader.result.toString();
      const configObj = ConvertToClientConfig(raw);
      if (configObj.hasOwnProperty("user") && configObj.hasOwnProperty("api_key") &&
        configObj.hasOwnProperty("ui_url") && configObj.hasOwnProperty("api_url")) {
        this.setState({
          newConfig: configObj,
        });
      } else {
        this.setState({
          snackbarMessage: "Config file does not contain all required properties.",
          snackbarOpen: true
        });
      }
    };
    reader.readAsText(file);
  }

  private save = () => () => {
    if (this.state.newConfig !== null) {
      this.props.updateClientConfig(this.state.newConfig);
      this.setState({
        snackbarMessage: "Config file saved.",
        snackbarOpen: true
      });
    } else {
      this.setState({
        snackbarMessage: "Please upload a valid config file before saving.",
        snackbarOpen: true
      });
    }
  }

  private onCloseSnackbar = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    this.setState({
      snackbarOpen: false
    });
  }
}

export default ConfigDrop;