# react-markdown-it-editor

一个基于`react`框架开发的`markdown`编辑器组件，此组件是从[零一大佬的编辑器组件源码](https://github.com/zero2one3/markdown-editor-reactjs)中找到的开发思路，并有多处借鉴。

## 快捷键

| 快捷键    | 说明                 |
| --------- | -------------------- |
| ctrl+z    | 撤销操作             |
| ctrl+y    | 前进一步操作         |
| ctrl+b    | 加粗选中文本         |
| ctrl+i    | 倾斜选中文本         |
| tab       | 缩进（支持多行）     |
| shift+tab | 取消缩进（支持多行） |

## Props

| 属性         | 类型                                      | 作用                           |
| ------------ | ----------------------------------------- | ------------------------------ |
| initialValue | string                                    | 初始文本，默认空字符串         |
| tabSpace     | number                                    | tab键缩进的字符数量，默认为4   |
| onChange     | `(value: string, htmlText: string)=>void` | 编辑器内容发生修改时触发的事件 |

