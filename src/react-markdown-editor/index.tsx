import React, { FC, ReactElement, useState, useRef, useCallback, useEffect } from 'react'
import { MarkdownEditContainer } from './style'
import NavBar from './navbar'
import md from './markdown'
import {
    Spin
} from 'antd';
import { IHistory, IKeyCodeMap } from './type'
import { getCursorPosition, setSelectionRange, addList } from './utils'
import 'antd/dist/antd.css';

let scrolling: 0 | 1 | 2 = 0;
let scrollTimer: any;
let renderTimer: any;
let history: IHistory = { value: '', pre: null, next: null, selectionStart: 0, selectionEnd: 0 }
let historyTimer: any;

const MarkdownEditor: FC = (): ReactElement => {

    const [value, setValue] = useState<string>('')
    const [htmlString, setHtmlString] = useState<string>('')
    const [line, setLine] = useState<string[]>([''])
    const [loading, setLoading] = useState<boolean>(true)

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
        let { keyCode, metaKey, ctrlKey, altKey, shiftKey } = e;
        const [start, end] = getCursorPosition(e.target)
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
                default:
                    break
            }
        }else{
            if(keyCode === IKeyCodeMap.tab){
                start === end ? 
                (
                    wrapSetValue(`${e.target.value.slice(0, start)}${' '.repeat(4)}${e.target.value.slice(end)}`) 
                )
                : 
                addList(e.target, ' '.repeat(4), wrapSetValue);
                e.preventDefault()
            }
        }
    }, [])

    const wrapSetValue = (value: string): void => {
        setValue(value)
        setHistory()
    }

    const setHistory = ()=>{
        const [start, end] = getCursorPosition(editorNode.current)
        if(historyTimer) clearTimeout(historyTimer);
        historyTimer = setTimeout(()=>{
            history.next = {
                value: editorNode.current.value,
                pre: history,
                next: null,
                selectionStart: start,
                selectionEnd: end
            }
            history = history.next
            console.log(history.pre)
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

    return (
        <MarkdownEditContainer>
            <NavBar
                value={value}
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
                        className="markdown-editor"
                        ref={editorNode}
                        onChange={handleChange}
                        onScroll={haneleScroll}
                        onKeyDown={handleKeyDown}
                    />
                    <div 
                        className="markdown-preview markdown-body" 
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