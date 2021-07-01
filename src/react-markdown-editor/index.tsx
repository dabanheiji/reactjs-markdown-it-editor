import React, { FC, ReactElement, useState, useRef, useCallback, useEffect } from 'react'
import { MarkdownEditContainer } from './style'
import NavBar from './navbar'
import md from './markdown'
import {
    Spin
} from 'antd';
import { IHistory, IKeyCodeMap, IProps } from './type'
import {
    getCursorPosition, setSelectionRange, addList, cancelTabSpace, handleText,
    clickEnter, autoComplementBracket
} from './utils'
import 'antd/dist/antd.css';

let scrolling: 0 | 1 | 2 = 0;
let scrollTimer: any;
let renderTimer: any;
let history: IHistory = { value: '', pre: null, next: null, selectionStart: 0, selectionEnd: 0 }
let historyTimer: any;

const config = {
    tabSpace: 4
}

const MarkdownEditor: FC<IProps> = ({
    initialValue = ''
}): ReactElement => {

    const [value, setValue] = useState<string>('')
    const [htmlString, setHtmlString] = useState<string>('')
    const [line, setLine] = useState<string[]>([''])
    const [loading, setLoading] = useState<boolean>(true)
    const [preview, setPreview] = useState<boolean>(false)

    const lineNode = useRef<any>(null)
    const editorNode = useRef<any>(null)
    const showNode = useRef<any>(null)

    const handleChange = useCallback((e: any): void => {
        wrapSetValue(e.target.value)
    }, [])

    const haneleScroll = useCallback((e: any): void => {
        let { target } = e
        let scale = getScale(target)
        lineNode.current.scrollTop = target.scrollTop
 
        if(target.nodeName === 'TEXTAREA') {
            if(scrolling === 0) scrolling = 1;
            else if(scrolling === 2) return;    
            driveScroll(scale, showNode.current)
        } else {
            if(scrolling === 0) scrolling = 2;
            else if(scrolling === 1) return;
            driveScroll(scale, editorNode.current)
        }
    }, [])

    const driveScroll = useCallback((scale: number, el: HTMLElement): void => {
        let { scrollHeight, clientHeight } = el
        el.scrollTop = (scrollHeight - clientHeight) * scale

        if(scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            scrolling = 0
            clearTimeout(scrollTimer)
        }, 200)
    }, [])

    const getScale = useCallback((node: HTMLElement): number => {
        let { scrollHeight, scrollTop, clientHeight } = node
        return scrollTop / (scrollHeight - clientHeight)
    }, [])

    const handleKeyDown = useCallback((e: any): void => {
        let { keyCode, ctrlKey, altKey, shiftKey } = e;
        const el = e.target
        // console.log(keyCode)
        if(ctrlKey){
            switch(keyCode){
                case IKeyCodeMap.ctrlZ:
                    if(!history.pre) return e.preventDefault();
                    var { value, selectionStart, selectionEnd } = history.pre;
                    setValue(value)
                    history = history.pre
                    setSelectionRange(editorNode.current, selectionStart, selectionEnd)
                    e.preventDefault()
                    break
                case IKeyCodeMap.ctrlY:
                    if(!history.next) return e.preventDefault();
                    var { value, selectionStart, selectionEnd } = history.next;
                    setValue(value)
                    history = history.next;
                    setSelectionRange(editorNode.current, selectionStart, selectionEnd)
                    e.preventDefault()
                    break
                case IKeyCodeMap.ctrlB:
                    handleText(editorNode.current, '**', '加粗文本', wrapSetValue)
                    e.preventDefault()
                    break
                case IKeyCodeMap.ctrlI:
                    handleText(editorNode.current, '*', '斜体文本', wrapSetValue)
                    e.preventDefault()
                    break
                default:
                    break
            }
        }else if(shiftKey){
            switch(keyCode){
                case IKeyCodeMap.tab:
                    cancelTabSpace(el, config.tabSpace, wrapSetValue)
                    e.preventDefault()
                    break
                case IKeyCodeMap.shift9:
                    autoComplementBracket(el, wrapSetValue, ['(', ')'])
                    e.preventDefault()
                    break
                case IKeyCodeMap.shiftArrayBracket:
                    autoComplementBracket(el, wrapSetValue, ['{', '}'])
                    e.preventDefault()
                    break
                case IKeyCodeMap.oneMark:
                    autoComplementBracket(el, wrapSetValue, ['\"', '\"'])
                    e.preventDefault()
                    break
                default:
                    break
            }
        }else{
            switch(keyCode){
                case IKeyCodeMap.tab:
                    addList(el, ' '.repeat(config.tabSpace), wrapSetValue, 2)
                    e.preventDefault()
                    break
                case IKeyCodeMap.enter:
                    clickEnter(el, wrapSetValue, config.tabSpace)
                    e.preventDefault()
                    break
                case IKeyCodeMap.shiftArrayBracket:
                    autoComplementBracket(el, wrapSetValue, ['[', ']'])
                    e.preventDefault()
                    break
                case IKeyCodeMap.oneMark:
                    autoComplementBracket(el, wrapSetValue, ['\'', '\''])
                    e.preventDefault()
                    break
                default:
                    break
            }
        }
    }, [])

    const wrapSetValue = (value: string, selectionStart : null | number = null, selectionEnd : null | number = null): void => {
        setValue(value)
        setHistory(selectionStart, selectionEnd)
    }

    const setHistory = (selectionStart : null | number, selectionEnd : null | number): void => {
        const [start, end] = getCursorPosition(editorNode.current)
        if(historyTimer) clearTimeout(historyTimer);
        historyTimer = setTimeout(()=>{
            history.next = {
                value: editorNode.current.value,
                pre: history,
                next: null,
                selectionStart: selectionStart ? selectionStart : start,
                selectionEnd: selectionEnd ? selectionEnd : end
            }
            history = history.next
            clearTimeout(historyTimer)
        }, 1000)
    }


    useEffect(()=>{
        if(renderTimer) clearTimeout(renderTimer);
        setLine(editorNode.current.value.split('\n'))
        renderTimer = setTimeout(() => {
            setHtmlString(md.render(value))
            clearTimeout(renderTimer)
        }, 200)
    },[value])

    useEffect(()=>{
        history.value = initialValue;
        setValue(initialValue)
        let len = initialValue.length;
        setSelectionRange(editorNode.current, len, len)
    }, [])

    return (
        <MarkdownEditContainer>
            <NavBar
                preview={preview}
                setPreview={setPreview}
                setValue={wrapSetValue}
                editorElement={editorNode.current}
                setLoading={setLoading}
            />
            <Spin
                size="large"
                spinning={loading}
                wrapperClassName="spining"
            >
                <div className="markdown-main">
                    <div className="line-container" ref={lineNode}>
                        {
                            line.map((item, index) => {
                                return (
                                    <p className="line-num" key={index}>{ index+1 }</p>
                                )
                            })
                        }
                    </div>
                    <textarea
                        value={value}
                        className={`markdown-editor ${preview ? 'hide' : ''}`}
                        ref={editorNode}
                        onChange={handleChange}
                        onScroll={haneleScroll}
                        onKeyDown={handleKeyDown}
                    />
                    <div 
                        className={`markdown-preview markdown-body ${preview ? 'prev' : ''}`} 
                        id="write"
                        ref={showNode}
                        onScroll={haneleScroll}
                        dangerouslySetInnerHTML={{__html: htmlString}}
                    ></div>
                </div>
            </Spin>
        </MarkdownEditContainer>
    )
}

export default MarkdownEditor