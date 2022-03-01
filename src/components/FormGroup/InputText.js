import react from 'react'

export default class FromGroup extends react.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="form-group">
                <label htmlFor={'filter-' + this.props.id} className="d-block text-truncate">
                    {this.props.name}
                </label>
                <input
                    type={this.props.type || "text"}
                    className="form-control"
                    id={"filter-" + this.props.id}

                    value={this.props.value}
                    onChange={this.props.onChange}
                    disabled={this.props.disabled}
                />
            </div>
        )
    }
}