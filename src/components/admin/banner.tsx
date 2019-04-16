import * as React from "react";
import { Card, CardContent, CardHeader, TextField } from '@material-ui/core';

interface Props {
    onBannerTextChange?:(text:string) => void;
    banner?:string;
}

export class BannerCard extends React.Component<Props> {
    public render() {
        return (
            <Card>
                <CardHeader title="Announcements" />
                <CardContent>
                    <TextField label="Banner Message" value={this.props.banner || ""} onChange={this.setBanner()}/>
                </CardContent>
            </Card>
        )
    }

    private setBanner = () => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (this.props.onBannerTextChange) {
            this.props.onBannerTextChange(event.currentTarget.value);
        }
      }
}