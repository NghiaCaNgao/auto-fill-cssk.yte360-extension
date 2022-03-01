import react from 'react'

export default class Checkbox extends react.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="form-check">
                <input
                    className="form-check-input"
                    type="checkbox"
                    checked={this.props.checked}
                    onChange={this.props.onChange}
                    disabled={this.props.disabled} />
                <label
                    htmlFor={"checkbox-" + this.props.id}
                    className="form-check-label d-block text-truncate">
                    {this.props.name}
                </label>
            </div>
        )
    }
}