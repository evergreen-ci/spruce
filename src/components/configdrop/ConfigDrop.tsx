import { Button, Card, CardActions, CardContent } from '@material-ui/core';
import { DropzoneArea } from 'material-ui-dropzone'
import * as React from 'react';
import { ClientConfig, ConvertToClientConfig } from '../../models/client_config';
import '../../styles.css';

class Props {
  public updateClientConfig: (configObj: ClientConfig) => void;
}

interface State {
  error: string
  newConfig: ClientConfig,
}

export class ConfigDrop extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
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
      console.log("Failed to read config file with error code: " + reader.error);
    };
    reader.onload = () => {
      const raw = reader.result.toString();
      const configObj = ConvertToClientConfig(raw);
      if (configObj.hasOwnProperty("user") && configObj.hasOwnProperty("api_key") &&
        configObj.hasOwnProperty("ui_url") && configObj.hasOwnProperty("api_url") ) {
        this.setState({
          newConfig: configObj,
        });
      } else {
        console.log("Config file does not contain all required properties");
      }
    };
    reader.readAsText(file);
  }

  private save = () => () => {
    if (this.state.newConfig !== null) {
      this.props.updateClientConfig(this.state.newConfig);
    }
  }
}

export default ConfigDrop;