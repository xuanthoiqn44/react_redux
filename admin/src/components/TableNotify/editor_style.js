import StyledComponent from "./style-component";
import styled from "styled-components"
import {Editor} from "primereact/editor";




export const StyledEditor = styled(StyledComponent(Editor))`
   .text-editor .DraftEditor-root{
    height: 220px;
   }
   .p-editor-container .p-editor-content{
    border: none
   }

`;