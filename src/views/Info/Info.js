import "./info.scss"
import { Component } from "react"
import ReactMarkdown from "react-markdown"
import README from "../../data/README.md"

export default class Info extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
        }
    }
    componentDidMount() {
        fetch(README)
            .then((response) => response.text())
            .then((text) => {
                this.setState({
                    data: text,
                })
            });
    }

    render() {
        return (
            <div className="af-info-page af-full-page">
                <div className="page-name">
                    <h1>Thông tin</h1>
                    <p>
                        Các thông tin liên quan bản quyền
                    </p>
                </div>
                <div className="page">
                    <div className="row">
                        <div className="col-md-6">
                            <ReactMarkdown children={this.state.data} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}