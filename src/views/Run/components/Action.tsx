import React from "react";

import { ReactComponent as PlayIcon } from "@/assets/icons/play.svg";
import { ReactComponent as GridIcon } from "@/assets/icons/grid4.svg";
import { ReactComponent as PlusIcon } from "@/assets/icons/pinpaperplus.svg";
import { ReactComponent as FilterIcon } from "@/assets/icons/filters3.svg";
import { ReactComponent as SearchIcon } from "@/assets/icons/search.svg";
import { ReactComponent as CheckIcon } from "@/assets/icons/pinpapercheck.svg";


export default function render() {
    return (
        <div className="d-flex mt-4 flex-row align-items-end justify-content-end">
            <button className="btn mx-1 btn-white btn-context-container" onClick={this.toggleButton.bind(this, "context_menu_more_action_show")}>
                <GridIcon />
                {
                    (this.state.context_menu_more_action_show)
                        ? (
                            <div className="btn-context-menu">
                                <button
                                    className="btn-context-item"
                                    onClick={this.removeCheckupReport.bind(this)}
                                    disabled={this.state.isRunning}>
                                    Xóa phiếu khám gần nhất
                                </button>
                                <button
                                    className="btn-context-item"
                                    onClick={this.clearData.bind(this)}
                                    disabled={this.state.isRunning}>
                                    Xóa danh sách
                                </button>
                            </div>)
                        : null
                }
            </button>

            <button
                className="btn btn-success mx-1 text-truncate"
                onClick={this.handleRun.bind(this)}
                disabled={this.state.isRunning}>
                <PlayIcon />
                <span>Chạy</span>
            </button>

            <button
                className="btn btn-info text-white mx-1 text-truncate"
                onClick={this.refineData.bind(this)}
                disabled={this.state.isRunning}>
                <FilterIcon />
                Lọc dữ liệu lỗi
            </button>

            <button
                className="btn btn-warning text-white mx-1 text-truncate"
                onClick={this.handleCheck.bind(this)}
                disabled={this.state.isRunning} >
                <CheckIcon />
                <span>Kiểm tra</span>
            </button>

            <div className="btn-group mx-1 text-truncate" role="group">
                <button
                    className="btn btn-primary"
                    onClick={this.handleFilter.bind(this)}
                    disabled={this.state.isRunning}>
                    <SearchIcon />
                    <span>Tìm kiếm</span>
                </button>
                <button
                    className="btn btn-primary-stronger"
                    onClick={this.handleAdd.bind(this)}
                    disabled={this.state.isRunning}>
                    <PlusIcon />
                </button>
            </div>

        </div>
    )
}