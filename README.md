# react-widget-upload

Upload基础组件


## 安装

```
npm install --save react-widget-upload
```

## 使用

[![Edit react-widget-upload](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/winter-morning-7uuhn?fontsize=14&hidenavigation=1&theme=dark)

```js
import Upload from 'react-widget-upload';
import 'react-widget-upload/style';

<Upload onChange={files => {...}}>选择文件</Upload>;

```

### Interfaces

```ts
export interface RWFile extends File {
    webkitRelativePath?: string;
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

```

### defaultProps

```js
{
	prefixCls: "rw-upload",
	tagName: "div",
	tabIndex: 0,
	maxFiles: Number.MAX_VALUE,
	droppable: true,
	openFileDialogOnClick: true,
}
```

### 基础样式

```css
.rw-upload {
    cursor: pointer;
}


```

### FAQ

`react-widget-upload`只负责将用户选择后的文件回传给使用者，并不进行实际的文件上传，使用者需要自行构建`FormData`，示例：

```js

function handleChange(files){
    if(!files.length) return;
    const file = files[0];

    const formData = new FormData();

    formData.append('file', file, file.name);

    post(url, formData);
}

```
