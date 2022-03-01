import react from 'react'
import Utils from "../../utils/utils";

export default class Select extends react.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="col-8 af-u-28">
                <select
                    className="custom-select form-control"
                    value={this.props.value}
                    onChange={this.props.onChange}
                    disabled={this.props.disabled}>
                    {
                        this.props.options.map((option, index) => (
                            <option
                                key={Utils.genKey()}
                                value={index + 1}>
                                {option}
                            </option>
                        ))
                    }
                </select>
            </div>
        )
    }
}