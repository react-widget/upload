import React, { Component } from "react";
import DemoList from "./DemoList";

export default class Demo extends Component {
	state = {
		current: DemoList[0],
	};

	onDemoChange(item, e) {
		this.setState({
			current: item,
		});
	}

	render() {
		const { current } = this.state;
		return (
			<div className="container">
				<div className="slider">
					{DemoList.map((item, i) => {
						return (
							<div
								key={i}
								className={current === item ? "active" : ""}
								onClick={this.onDemoChange.bind(this, item)}
							>
								{item.label}
							</div>
						);
					})}
				</div>
				<div className="content">{current ? <current.component /> : null}</div>
			</div>
		);
	}
}
