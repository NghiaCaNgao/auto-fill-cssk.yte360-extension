import React from 'react'
import Utils from "@/utils/utils";

type Props = {
    id: string,
    name: string,
    value: any,
    placeholder?: string,
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void,
    disabled?: boolean,
    dataset: Array<{
        value: string | number,
        label: string
    }>
}

export default class CustomSelect extends React.Component<Props, {}> {
    render() {
        return (
            <div className="form-group">
                <label htmlFor={"config-" + this.props} className="col-6 col-form-label">{this.props.name}</label>
                <div className="col-6">
                    <select
                        className="form-control"
                        id={"input-" + this.props.id}
                        value={this.props.value}
                        disabled={this.props.disabled}
                        onChange={this.props.onChange}>
                        {this.props.dataset.map(item =>
                            <option key={Utils.genKey()} value={item.value}>{item.label} </option>)}
                    </select>
                </div>
            </div >
        )
    }
}