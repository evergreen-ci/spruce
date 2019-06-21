import { DropzoneArea } from 'material-ui-dropzone'
import * as React from 'react';
import {ClientConfig, ConvertToClientConfig} from '../../models/client_config';
import '../../styles.css';

class Props {
  public updateClientConfig: (configObj: ClientConfig) => void;
}

interface State {
  processing: boolean,
  error: string
}

export class ConfigDrop extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      processing: false,
      error: null
    };
  }

  public render() {
    return (
      <DropzoneArea onChange={this.handleDropAreaChange} 
        dropzoneText={"Drop your config file here"} 
        showAlerts={false} 
        filesLimit={1}
        acceptedFiles={["application/json"]}/>
    )
  }

  private handleDropAreaChange = (fileArray: File[]) => {
    if(fileArray.length !== 0) {
      this.setState({ 
        processing: true,
      });
      this.upload(fileArray[0]);
    }
  }


  private upload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const raw = reader.result.toString();
      const configObj = ConvertToClientConfig(raw);
      this.props.updateClientConfig(configObj);
    };
    reader.readAsText(file);
    
  }
}

export default ConfigDrop;