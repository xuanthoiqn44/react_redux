import StyledComponent from "./style-component";
import styled from "styled-components"
import {DataTable} from "primereact/components/datatable/DataTable";

export const StyledDataTable = styled(StyledComponent(DataTable))`
    .p-datatable-wrapper {
        box-shadow: rgb(208, 208, 208) 0px 0px 10px;
    }
    .p-datatable .p-datatable-thead > tr > th {
        border: 0;
        background-color: white; 
    }
    .p-datatable .p-datatable-tbody > tr > td {
        border: 0;
    }
    .p-datatable .p-sortable-column.p-highlight {
        color: #555555;
    }
    .p-datatable .p-sortable-column.p-highlight a {
        color: #555555
    }
    .p-datatable-row {
        text-align: center
    }
    .p-paginator {
        background-color: white;
        border: 0;
        margin-top: 1rem;
    }
    .p-datatable-row:focus {
        outline: none
    }
    .p-sortable-column:hover {
        background: none !important
    }
    .p-paginator .p-paginator-pages .p-paginator-page.p-highlight{
        background:rgba(11,225,182,0.8) !important;
        border-radius: 50%
    }
    .p-dropdown-panel .p-dropdown-items .p-dropdown-item.p-highlight {
        background:rgba(11,225,182,0.8) !important;
    }
`;