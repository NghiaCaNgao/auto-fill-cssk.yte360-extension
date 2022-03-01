import Filter from "./components/Filter"
import Config from "./components/Config"
import Action from "./components/Action"
import Table from "./components/Table";
import TableAction from "./components/TableAction";

export default function render() {
    return (
        <div className="af-configs-page af-full-page" >
            <div className="af-filter">
                {Filter.call(this)}
                {Config.call(this)}
                {Action.call(this)}
            </div >

            <div className="mt-5 af-table">
                {TableAction.call(this)}
                {Table.call(this)}
            </div>
        </div >
    );
};