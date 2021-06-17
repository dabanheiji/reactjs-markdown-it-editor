import React, { FC, ReactElement, useCallback, useState, useEffect } from 'react'
import { NavBarContainer } from './style'
import {
    BoldOutlined
} from '@ant-design/icons'
import { message, Tooltip } from 'antd'
import {
    handleText
} from './utils'
import { IProps } from './type'

const codeThemeList = ['default','hybrid', 'dark', 'github', 'atelier-lakeside-dark', 'color-brewer', 'docco', 'mono-blue', 'paraiso-dark']
const markdownThemeList = ['maize', 'guthub']

const NavBar: FC<IProps> = ({
    value,
    setValue,
    editorElement
}): ReactElement => {
    
    const [codeTheme, setCodeTheme] = useState<string>('hybrid')
    const [markdownTheme, setMarkdownTheme] = useState<string>('guthub')
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        let head = document.head
        let oldLink = head.getElementsByClassName('markdownTheme-style-link')

        if(oldLink.length) head.removeChild(oldLink[0])

        let newLink = document.createElement('link')
        newLink.setAttribute('rel', 'stylesheet')
        newLink.setAttribute('type', 'text/css')
        newLink.setAttribute('class', 'markdownTheme-style-link')
        newLink.setAttribute('href', `https://cdn.bootcdn.net/ajax/libs/primer-markdown/4.1.0-alpha.e45cefe1/build.min.css`)
        newLink.onload = () => setLoading(false);
        newLink.onerror = () => {
            setLoading(false);
            message.error('主题获取失败，请稍后重试或尝试其它主题')
        }
        head.appendChild(newLink)
    }, [markdownTheme])

    useEffect(()=>{
        let head = document.head;
        let oldLink = head.getElementsByClassName('highlightjs-style-link')
        if(oldLink.length) head.removeChild(oldLink[0])

        let newLink = document.createElement('link')
        newLink.setAttribute('rel', 'stylesheet')
        newLink.setAttribute('type', 'text/css')
        newLink.setAttribute('class', 'highlightjs-style-link')
        newLink.setAttribute('href', `https://cdn.bootcss.com/highlight.js/9.6.0/styles/${codeTheme}.min.css`)
        newLink.onload = () => setLoading(false);
        newLink.onerror = () => {
            setLoading(false);
            message.error('主题获取失败，请稍后重试或尝试其它主题')
        }
        head.appendChild(newLink)
    }, [codeTheme])

    

    return (
        <NavBarContainer>
            <Tooltip title="加粗">
                <BoldOutlined className="item" onClick={()=>handleText(editorElement, '**', '加粗文本', setValue)} />
            </Tooltip>
            
        </NavBarContainer>
    )
}

export default NavBar