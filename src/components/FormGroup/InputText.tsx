import React from 'react'
import react from 'react'

type Props = {
    id: string,
    name: string,
    value: string | number,
    placeholder?: string,
    type?: string,
    disabled?: boolean,
    children?: React.ReactNode
    onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
}

export default class FromGroup extends react.Component<Props, {}> {
    render() {
        return (
            <div className="form-group">
                <label htmlFor={'filter-' + this.props.id} className="d-block text-truncate">
                    {this.props.name}
                </label>
                {this.props.type === 'textarea'
                    ?
                    <textarea
                        rows={4}
                        className="form-control"
                        id={"input-" + this.props.id}

                        placeholder={this.props.placeholder}
                        value={this.props.value}
                        onChange={this.props.onChange}
                        disabled={this.props.disabled}
                    />
                    : <input
                        type={this.props.type || "text"}
                        className="form-control"
                        id={"input-" + this.props.id}

                        placeholder={this.props.placeholder}
                        value={this.props.value}
                        onChange={this.props.onChange}
                        disabled={this.props.disabled}
                    />
                }
            </div>
        )
    }
}