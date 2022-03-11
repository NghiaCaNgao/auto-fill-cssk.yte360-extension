import react from 'react'

type Props = {
    id: string,
    name: string,
    checked: boolean,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    disabled?: boolean
}

export default class Checkbox extends react.Component<Props, {}> {
    render() {
        return (
            <div className="form-check">
                <input
                    id={"checkbox-" + this.props.id}
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