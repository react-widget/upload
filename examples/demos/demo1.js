import React, { Component } from "react";
import Upload from "../../src";

export default class DEMO extends Component {
	state = {
		files: [],
	};

	handleChange = (files) => {
		this.setState({
			files,
		});

		console.log(files);
	};

	render() {
		const { files } = this.state;

		return (
			<div>
				<div className="upload-test">
					<Upload
						onChange={this.handleChange}
						className="upload1"
						directory
						multiple
						openFileDialogOnClick={true}
						droppable={true}
					>
						<div>拖拽文件到这里</div>
					</Upload>
					<Upload
						onChange={this.handleChange}
						className="upload2"
						directory
						multiple
						droppable={false}
					>
						<button>文件上传</button>
					</Upload>
				</div>
				<table
					style={{
						width: 600,
						margin: "0 auto",
						marginTop: 20,
					}}
				>
					<thead>
						<tr>
							<th>文件名</th>
							<th>类型</th>
							<th>路径</th>
							<th>大小</th>
							<th>修改时间</th>
						</tr>
					</thead>
					<tbody>
						{files.map((file) => {
							return (
								<tr>
									<td>{file.name}</td>
									<td>{file.type}</td>
									<td>{file.webkitRelativePath}</td>
									<td>{file.size}</td>
									<td>{file.lastModified}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		);
	}
}
