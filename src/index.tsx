import React from "react";
import classnames from "classnames";

export interface RWFile extends File {
	webkitRelativePath?: string;
}

function scanFiles(item: any, files: RWFile[] = [], maxFiles: number = 0): Promise<void> {
	if (files.length > maxFiles) {
		return Promise.resolve();
	}

	if (item.isDirectory) {
		return new Promise((resolve) => {
			let directoryReader = item.createReader();
			directoryReader.readEntries(
				function (entries: any[]) {
					const p: Promise<void>[] = [];
					entries.forEach(function (entry: any) {
						p.push(scanFiles(entry, files, maxFiles));
					});

					Promise.all(p).then(() => resolve());
				},
				() => resolve()
			);
		});
	} else {
		return new Promise((resolve) => {
			item.file(
				(file: RWFile) => {
					if (files.length >= maxFiles) {
						resolve();
						return;
					}

					if (item.fullPath && !file.webkitRelativePath) {
						Object.defineProperties(file, {
							webkitRelativePath: {
								writable: true,
							},
						});
						file.webkitRelativePath = item.fullPath.replace(/^\//, "");
						Object.defineProperties(file, {
							webkitRelativePath: {
								writable: false,
							},
						});
					}

					files.push(file);

					resolve();
				},
				() => resolve()
			);
		});
	}
}

export interface UploadProps extends Omit<React.HTMLAttributes<any>, "onChange"> {
	/** 组件样式前缀 */
	prefixCls?: string;
	/** 组件标签 */
	tagName?: string;
	/** input name属性 */
	name?: string;
	/** input accept */
	accept?: string;
	/** input multiple */
	multiple?: boolean;
	/** input key，用于部分情况下重新创建input */
	inputKey?: React.Key;
	/** 是否支持文件夹上传 */
	directory?: boolean;
	/** 禁用 */
	disabled?: boolean;
	/** 禁用，相比disabled只是默认样式不同 */
	readOnly?: boolean;
	/** 点击时打开系统文件选择窗口 */
	openFileDialogOnClick?: boolean;
	/** 是否支持拖拽上传 */
	droppable?: boolean;
	/** 设置选择onChange接收的最大文件数，默认为无限 */
	maxFiles?: number;
	/** 用户选择或取消选择后的回调 */
	onChange?: (files: RWFile[]) => void;
}

export const version = "%VERSION%";

export class Upload extends React.Component<UploadProps> {
	static defaultProps: UploadProps = {
		prefixCls: "rw-upload",
		tagName: "div",
		tabIndex: 0,
		maxFiles: Number.MAX_VALUE,
		droppable: true,
		openFileDialogOnClick: true,
	};

	inputRef: React.RefObject<HTMLInputElement> = React.createRef();

	isDisabledOrReadOnly() {
		return this.props.disabled || this.props.readOnly;
	}

	handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { maxFiles, onChange } = this.props;

		const items = e.target.files || [];
		const files: RWFile[] = [];
		const fileLen = Math.max(maxFiles!, items.length);

		for (let i = 0; i < fileLen; i++) {
			files.push(items[i]);
		}

		if (onChange) {
			onChange(files);
		}
	};

	handleClick = (e: React.MouseEvent) => {
		const { openFileDialogOnClick, onClick } = this.props;

		if (!this.isDisabledOrReadOnly() && openFileDialogOnClick) {
			this.inputRef.current?.click();
		}

		if (onClick) {
			onClick(e);
		}
	};

	handleKeyDown = (e: React.KeyboardEvent) => {
		const { openFileDialogOnClick, onKeyDown } = this.props;

		if (e.keyCode === 13 && !this.isDisabledOrReadOnly() && openFileDialogOnClick) {
			this.inputRef.current?.click();
		}

		if (onKeyDown) {
			onKeyDown(e);
		}
	};

	handleDragOver = (e: React.DragEvent) => {
		const { onDragOver } = this.props;

		e.preventDefault();

		if (onDragOver) {
			onDragOver(e);
		}
	};

	handleDrop = (e: React.DragEvent) => {
		const { directory, maxFiles, droppable, onDrop, onChange } = this.props;
		const files: RWFile[] = [];

		e.preventDefault();

		if (onDrop) {
			onDrop(e);
		}

		if (this.isDisabledOrReadOnly() || !droppable) return;

		let items = e.dataTransfer.files;

		if (directory) {
			const items = e.dataTransfer.items;
			const p: Promise<void>[] = [];

			for (let i = 0; i < items.length; i++) {
				let item = items[i].webkitGetAsEntry();

				if (item) {
					p.push(scanFiles(item, files, maxFiles));
				}
			}

			Promise.all(p).then(() => {
				if (onChange) {
					onChange(files);
				}
			});
		} else {
			const fileLen = Math.max(maxFiles!, items.length);
			for (let i = 0; i < fileLen; i++) {
				files.push(items[i]);
			}

			if (onChange) {
				onChange(files);
			}
		}
	};

	render() {
		const {
			prefixCls,
			className,
			name,
			accept,
			multiple,
			inputKey,
			tabIndex,
			children,
			tagName,
			onChange,
			disabled,
			readOnly,
			directory,
			openFileDialogOnClick,
			maxFiles,
			droppable,
			...restProps
		} = this.props;
		const cls = classnames(
			prefixCls,
			{
				[`${prefixCls}-disabled`]: disabled,
				[`${prefixCls}-readonly`]: readOnly,
			},
			className
		);

		const Tag = tagName!;

		const inputProps: any = {
			directory: directory ? "directory" : null,
			webkitdirectory: directory ? "webkitdirectory" : null,
		};

		return (
			<Tag
				{...(restProps as any)}
				tabIndex={tabIndex}
				className={cls}
				onClick={this.handleClick}
				onKeyDown={this.handleKeyDown}
				onDragOver={this.handleDragOver}
				onDrop={this.handleDrop}
			>
				<input
					{...inputProps}
					key={inputKey}
					ref={this.inputRef}
					name={name}
					accept={accept}
					multiple={multiple}
					type="file"
					style={{ display: "none" }}
					onClick={(e) => e.stopPropagation()}
					onChange={this.handleChange}
				/>
				{children}
			</Tag>
		);
	}
}

export default Upload;
