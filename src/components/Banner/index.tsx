import React from 'react';
import styled from "@emotion/styled";

type BannerType = "success" | "error" | "info" | "warning"
interface Props {
    type: BannerType
}
export const Banner: React.FC<Props> = ({type}) => {
    return (
        <BannerDiv type={type}>
            
        </BannerDiv>
    )
}

const mapTypeToBorderColor: {[type: BannerType]: string} = {
    
}
const mapTypeToBackgroundColor: {[type: BannerType]: string} = {

}

const BannerDiv = styled.div`
    border-color: ${({type}: Props) => }
`
